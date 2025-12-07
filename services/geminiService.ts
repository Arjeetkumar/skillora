import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key exists
const checkApiKey = () => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will mock a response.");
    return false;
  }
  return true;
};

export const generateHeadline = async (role: string): Promise<string> => {
  if (!checkApiKey()) return `Professional ${role} Expert`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a catchy, professional LinkedIn-style profile headline (max 8 words) for a ${role}. Do not include quotes.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("AI Error:", error);
    return `Expert ${role} | Delivering Excellence`;
  }
};

export const polishText = async (text: string, tone: 'professional' | 'concise' | 'engaging' = 'professional'): Promise<string> => {
  if (!checkApiKey()) return text + " (Polished)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following text to be ${tone}, clear, and grammatically correct. Keep the original meaning but improve flow: "${text}"`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("AI Error:", error);
    return text;
  }
};

export const draftProposal = async (jobTitle: string): Promise<string> => {
  if (!checkApiKey()) return "I am very interested in this job. I have the skills required...";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, engaging freelance proposal cover letter for a job titled "${jobTitle}". Keep it under 100 words. Focus on value delivery.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("AI Error:", error);
    return "Dear Client,\n\nI reviewed your job posting for " + jobTitle + " and I am confident I can deliver excellent results. I have experience in this field and can start immediately.\n\nBest regards,";
  }
};

export const generateJobDescription = async (title: string): Promise<string> => {
  if (!checkApiKey()) return "We are looking for a skilled " + title + " to join our team...";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a concise 2-sentence job description for a "${title}" role. Mention key responsibilities and required impact.`,
    });
    return response.text.trim();
  } catch (error) {
    return "We are looking for a skilled professional to handle this project efficiently. Please provide your portfolio.";
  }
};

export const analyzeJobMatch = async (jobDescription: string, mySkills: string): Promise<{ score: number, reason: string }> => {
    if(!checkApiKey()) return { score: 85, reason: "Your skills align well with the requirements."};

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the match between these skills: "${mySkills}" and this job: "${jobDescription}". Return a JSON object with "score" (0-100) and "reason" (max 15 words).`
        });
        
        // Simple parsing attempt, fallback if markdown
        const text = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (e) {
        return { score: 75, reason: "Good potential match based on keywords." };
    }
}