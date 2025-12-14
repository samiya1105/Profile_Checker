import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

export const analyzeProfile = async (
  profileUrl: string,
  platform: string,
  context: string
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert Cybersecurity Analyst.
    
    The user is checking their OWN social media profile URL: "${profileUrl}" (${platform}).
    
    PHASE 1: VALIDATION
    First, use Google Search to verify if this URL exists and represents a real social media profile.
    If the URL is broken, a 404, leads to a non-existent user, or is clearly a random/garbage string (e.g., "unknown link", "djskhfksdj"), 
    STOP IMMEDIATELY and return the result with:
    - "overallRisk": "UNKNOWN"
    - "safetyScore": 0
    - "summary": "The provided link does not appear to be a valid or accessible social media profile. We could not perform a security audit."
    - Empty arrays for vulnerabilities, recommendations, etc.

    PHASE 2: SECURITY ANALYSIS (Only if valid)
    If valid, analyze the public footprint using Google Search:
    1. **Phishing/Impersonation**: Are there other sites mimicking this user?
    2. **Reputation**: Are there public reports of this account being hacked or used for scams?
    3. **Privacy Gaps**: Is sensitive info (phone, address) easily found via this handle?
    
    PHASE 3: REPORT GENERATION
    Generate a JSON report.
    - **Action Plan/Recommendations**: These MUST be specific to the findings. Do NOT give generic advice like "Enable 2FA" unless you see a specific reason (e.g., "High value target"). Give advice based on the SPECIFIC visible risks.
    - **Risk Level**: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'. Use 'UNKNOWN' only if the link is invalid.

    PRIVACY RULES:
    - Refer to the user as "The Account".
    - Do NOT output specific private data (e.g., do not write the actual phone number, just say "Phone number visible").

    OUTPUT FORMAT:
    Return strictly raw JSON. No markdown.
    
    Structure:
    {
      "safetyScore": number (0-100, use 0 if UNKNOWN),
      "overallRisk": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN",
      "summary": "string",
      "vulnerabilities": [
        { "severity": "string", "title": "string", "description": "string" }
      ],
      "recommendations": ["string (specific to this account)"],
      "positiveFindings": ["string"]
    }
    
    Context from user: "${context}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a security auditor. You return strictly JSON. You handle invalid links by returning RiskLevel.UNKNOWN."
      },
    });

    const text = response.text || "";
    
    // Robust JSON extraction
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      console.error("Raw response:", text);
      throw new Error("AI response was not in JSON format.");
    }

    const cleanJson = text.substring(firstBrace, lastBrace + 1);
    
    let result: AnalysisResult;
    try {
      result = JSON.parse(cleanJson) as AnalysisResult;
    } catch (e) {
      console.error("Failed to parse JSON:", cleanJson);
      throw new Error("Received malformed data from security scan. Please try again.");
    }

    // Explicitly ignoring source grounding chunks as per user request
    result.sources = []; 

    return result;

  } catch (error) {
    console.error("Analysis failed", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to analyze the profile. Please ensure the URL is correct and try again.");
  }
};