import { GoogleGenAI } from "@google/genai";
import { SEOStrategy, Source } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSEOStrategy = async (topic: string): Promise<SEOStrategy> => {
  const prompt = `
    Act as an expert SEO strategist and content architect.
    Research the internet for the following main pillar topic: "${topic}".
    
    Your task is to build a complete pillar–sub-pillar content system using current SEO, semantic search, and AI/SGE best practices.
    
    Requirements:
    1. Identify 1 Core Pillar Page (the main authoritative topic).
    2. Find the Top 10 Sub-Pillar Topics directly related to the pillar.
       - Must be high search-volume and user-intent driven based on current trends.
       - Include a mix of Informational, Commercial, and Transactional intents.
    
    For each sub-pillar, provide:
    - Primary keyword
    - Supporting semantic keywords (LSI / entities) - provide 3-5
    - Keyword Difficulty estimate based on competition (Easy, Medium, Hard)
    - Topic Cluster Keywords: Identify 2-3 related keywords that could form supporting articles for this sub-pillar.
    - Search intent (Informational, Commercial, Transactional)
    - Content angle: Refined specifically for AI-generated answers (SGE). Suggest unique data points, expert opinions, or structured formats that allow the content to be cited by AI.
    - Internal linking recommendation (specific anchor text or strategy to link back to pillar)

    Output Format:
    You must return a strictly formatted JSON object wrapped in a markdown code block (e.g., \`\`\`json ... \`\`\`).
    The JSON structure must be:
    {
      "pillar": {
        "topic": "The main topic",
        "pageTitle": "Optimized H1 Title",
        "searchIntent": "Dominant intent",
        "targetAudience": "Who is this for?"
      },
      "subPillars": [
        {
          "primaryKeyword": "...",
          "semanticKeywords": ["...", "..."],
          "clusterKeywords": ["...", "..."],
          "keywordDifficulty": "Medium",
          "searchIntent": "...",
          "contentAngle": "...",
          "internalLinking": "..."
        },
        ... (10 items total)
      ]
    }
    
    Do not include any conversational text outside the JSON block.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseSchema is NOT allowed with googleSearch, so we request JSON via prompt
      },
    });

    // 1. Extract Text
    const text = response.text || "";

    // 2. Extract Sources (Grounding)
    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Source",
            uri: chunk.web.uri,
          });
        }
      });
    }

    // 3. Parse JSON
    // Regex to find the JSON block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    
    let jsonStr = "";
    if (jsonMatch && jsonMatch[1]) {
      jsonStr = jsonMatch[1];
    } else {
      // Fallback: try to find start/end of object if no code blocks
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        jsonStr = text.substring(start, end + 1);
      } else {
         throw new Error("Could not parse structured data from the AI response.");
      }
    }

    const parsedData = JSON.parse(jsonStr);

    return {
      pillar: parsedData.pillar,
      subPillars: parsedData.subPillars,
      sources: sources
    };

  } catch (error) {
    console.error("SEO Strategy Generation Error:", error);
    throw error;
  }
};
