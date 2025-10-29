import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const MAX_RETRIES = 5
const INITIAL_DELAY = 2000

async function retryWithBackoff(fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> {
  let lastError: any

  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      if ((error?.status === 503 || error?.status === 429) && i < retries - 1) {
        const delay = INITIAL_DELAY * Math.pow(2, i)
        console.log(`[v0] API overloaded, retrying in ${delay}ms (attempt ${i + 1}/${retries})`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else if (i < retries - 1) {
        // For other errors, also retry with delay
        const delay = INITIAL_DELAY * Math.pow(2, i)
        console.log(`[v0] Error occurred, retrying in ${delay}ms (attempt ${i + 1}/${retries})`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  console.error("[v0] All retries exhausted, using fallback response")
  return null
}

// Fallback disease detection response
function getFallbackDiseaseResponse() {
  return {
    disease: "Service Temporarily Unavailable",
    confidence: 0,
    severity: "unknown",
    treatment: "The AI analysis service is currently overloaded. Please try again in a few moments.",
    preventionTips: [
      "Maintain proper plant hygiene",
      "Ensure adequate spacing between plants",
      "Monitor plants regularly for early signs of disease",
      "Keep records of plant health observations",
    ],
  }
}

export async function POST(request: Request) {
  try {
    const { imageBase64, plantType } = await request.json()

    if (!imageBase64) {
      return Response.json({ error: "Image data is required" }, { status: 400 })
    }

    const prompt = `You are an expert plant pathologist. Analyze this plant image and detect any diseases present.

Plant Type: ${plantType || "Unknown"}

Based on the image, provide your response as a JSON object with these exact fields:
- disease: Name of the detected disease (or "Healthy Plant" if no disease)
- confidence: Confidence level (0-100)
- severity: One of "mild", "moderate", or "severe"
- treatment: Recommended treatment
- preventionTips: Array of prevention tips (as strings)

Return ONLY the JSON object, no other text.`

    const base64Data = imageBase64.split(",")[1] || imageBase64
    const mediaType = imageBase64.includes("data:image/png") ? "image/png" : "image/jpeg"

    let diseaseData

    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
      return await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: mediaType,
          },
        },
        {
          text: prompt,
        },
      ])
    })

    if (!result) {
      // API failed after all retries, use fallback
      diseaseData = getFallbackDiseaseResponse()
    } else {
      let text = result.response.text()

      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        text = jsonMatch[1].trim()
      }

      diseaseData = JSON.parse(text)
    }

    return Response.json(diseaseData)
  } catch (error) {
    console.error("Error detecting disease:", error)
    return Response.json(getFallbackDiseaseResponse())
  }
}
