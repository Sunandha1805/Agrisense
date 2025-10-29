import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const MAX_RETRIES = 5
const INITIAL_DELAY = 2000

function isRetryableError(error: any): boolean {
  const errorString = error?.toString() || ""
  const errorMessage = error?.message || ""

  // Check for 503 or 429 status codes in error message or status property
  return (
    error?.status === 503 ||
    error?.status === 429 ||
    errorString.includes("503") ||
    errorString.includes("429") ||
    errorString.includes("overloaded") ||
    errorString.includes("UNAVAILABLE") ||
    errorMessage.includes("503") ||
    errorMessage.includes("429") ||
    errorMessage.includes("overloaded")
  )
}

async function retryWithBackoff(fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> {
  let lastError: any

  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      const isRetryable = isRetryableError(error)

      if (isRetryable && i < retries - 1) {
        const delay = INITIAL_DELAY * Math.pow(2, i)
        console.log(`[v0] API overloaded, retrying in ${delay}ms (attempt ${i + 1}/${retries})`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else if (i < retries - 1) {
        const delay = INITIAL_DELAY * Math.pow(2, i)
        console.log(`[v0] Error occurred, retrying in ${delay}ms (attempt ${i + 1}/${retries})`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  console.error("[v0] All retries exhausted, using fallback response")
  return null
}

// Fallback recommendations based on location and crop
function getFallbackRecommendations(location: string, currentCrop: string) {
  const recommendations: Record<string, any[]> = {
    karnataka: [
      { name: "Rice", score: 85, reason: "Well-suited to Karnataka's climate and soil conditions" },
      { name: "Sugarcane", score: 82, reason: "Thrives in warm, humid conditions of Karnataka" },
      { name: "Maize", score: 78, reason: "Good alternative crop for rotation" },
    ],
    maharashtra: [
      { name: "Sugarcane", score: 88, reason: "Ideal for Maharashtra's climate" },
      { name: "Cotton", score: 85, reason: "Well-established crop in the region" },
      { name: "Jowar", score: 80, reason: "Drought-resistant option" },
    ],
    punjab: [
      { name: "Wheat", score: 90, reason: "Primary crop of Punjab with excellent yields" },
      { name: "Rice", score: 87, reason: "Complementary crop for rotation" },
      { name: "Maize", score: 82, reason: "Growing popularity in the region" },
    ],
  }

  const key = location.toLowerCase()
  return recommendations[key] || recommendations.karnataka
}

export async function POST(request: Request) {
  try {
    const { location, soilData, weatherData, farmArea, currentCrop } = await request.json()

    const prompt = `You are an expert agricultural advisor. Based on the following farm data, provide the top 3 crop recommendations with scores and reasons.

Farm Location: ${location.city}, ${location.state}
Current Crop: ${currentCrop || "Not specified"}
Farm Area: ${farmArea} hectares
Weather: Temperature ${weatherData?.temperature_2m || "25"}°C, Humidity ${weatherData?.relative_humidity_2m || "70"}%
Soil Data: Nitrogen ${soilData?.nitrogen || "100"} kg/ha, Phosphorus ${soilData?.phosphorus || "45"} kg/ha, Potassium ${soilData?.potassium || "48"} kg/ha, pH ${soilData?.ph || "7.5"}

Provide your response as a JSON array with exactly 3 objects, each containing:
- name: crop name
- score: recommendation score (0-100)
- reason: brief reason for recommendation

Return ONLY the JSON array, no other text.`

    let recommendations

    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
      return await model.generateContent(prompt)
    })

    if (!result) {
      recommendations = getFallbackRecommendations(location.state, currentCrop)
    } else {
      let text = result.response.text()

      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        text = jsonMatch[1].trim()
      }

      recommendations = JSON.parse(text)
    }

    return Response.json({ recommendations })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    try {
      const body = await request.json()
      return Response.json({
        recommendations: getFallbackRecommendations(body.location?.state || "karnataka", body.currentCrop || ""),
      })
    } catch {
      return Response.json({
        recommendations: getFallbackRecommendations("karnataka", ""),
      })
    }
  }
}
