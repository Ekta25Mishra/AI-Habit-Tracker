import { GoogleGenAI } from "@google/genai";

let client = null;
const getClient = () => {
  if (client) return client;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  client = new GoogleGenAI({ apiKey: key });
  return client;
};

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const isAIEnabled = () => !!process.env.GEMINI_API_KEY;

export const parseJSON = (text) => {
  let cleaned = (text || "").trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```\n?/g, "");
  }
  return JSON.parse(cleaned.trim());
};

export const chatCompletion = async ({ system, user, temperature = 0.7 }) => {
  const c = getClient();
  if (!c) {
    return {
      ok: false,
      content:
        " AI features are disabled - set GEMINI_API_KEY in the backend .env to enable real AI responses. Meanwhile here is something for you...",
    };
  }
  try {
    const res = await c.models.generateContent({
      model: MODEL,
      contents: user,
      config: {
        systemInstruction: system,
        temperature,
      },
    });
    return {
      ok: true,
      content: (res.text || "").trim(),
    };
  } catch (err) {
    console.error("AI error:", err.message);
    return { ok: false, content: "AI request failed. Please try again later." };
  }
};

export const SYSTEM_PROMPTS = {
  weekly: 
  "You are a warm, encouraging habit coach. Analyse the user's last 7 days of habit data and write a short personalized report (120-180 words). Mention: what went well, what struggled, patterns noticed, and one specific piece of encouragement. Use the user's habit names. Be human, not generic. No markdown header - use plain prose with line breaks. ",
  suggestion:
  "You are a helpful habit coach. Based on the user's goals, productive time, and past struggles, suggest exactly 3 personalized habits. Return valid JSON only with this shape: {\"suggestions\":[{\"name\":\"...\",\"description\":\"...\",\"frequency\":\"daily|weekly\",\"category\":\"Health|Fitness|Learning|Mindfulness|Productivity|Social|Finance|Creative|Other\",\"icon\":\"<emoji>\",\"reason\":\"...\"}]}. No pros outside JSON.",
  recovery:
      "You are a compassionate habit coach helping users recover from inconsistency. Analyse the user's recent missed habits, streak breaks, completion history, and active habits. Write a short personalized recovery message (100-150 words). Do not shame or guilt the user. Mention specific habits that were missed, identify one likely pattern or obstacle, remind them of previous successes if visible in the data, and suggest one small actionable step they can take today to restart momentum. Focus on progress over perfection. Use the user's habit names naturally. Sound supportive, practical, and human. No markdown header.",

  chat:
      "You are EchoMind, a friendly AI habit coach and accountability partner. Answer the user's message naturally and conversationally. Use available habit, streak, goal, and productivity data when relevant. Keep responses concise, supportive, and actionable. If the user discusses habits, productivity, routines, motivation, focus, discipline, learning, fitness, health, or self-improvement, provide practical guidance tailored to their situation. Celebrate progress, acknowledge challenges, and encourage consistency. Avoid generic motivational speeches. Do not invent habit data that was not provided. Keep most responses under 150 words unless a detailed explanation is requested.",

  morning:
      "You are a positive morning habit coach. Based on the user's active habits, goals, streaks, productive time, and recent performance, write a personalized morning message (80-120 words). Greet the user warmly, highlight one positive observation from recent activity, remind them of 1-3 important habits for today, and end with a short motivating thought focused on today's actions. Use habit names naturally. Be energetic, encouraging, and specific. Avoid clichés and generic quotes. No markdown header."

}
