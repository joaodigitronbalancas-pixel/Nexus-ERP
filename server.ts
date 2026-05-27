/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse json requests
app.use(express.json());

// Lazy-initialization client helper conforming to system constraints
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environments");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST route for server-side Gemini API calls
app.post("/api/gemini/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  try {
    const client = getAiClient();
    const result = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é o Nexus Copilot, um agente de IA especialista para um sistema ERP SaaS voltado para indústrias metalúrgicas e comércio varejista/atacadista. Responda em Português brasileiro de forma objetiva, técnica e profissional com insights acionáveis com bullet points.",
        temperature: 0.7,
      }
    });

    res.json({ reply: result.text });
  } catch (error: any) {
    console.error("Gemini server-side error:", error.message || error);
    res.status(500).json({ error: "Falha na geração de insights por IA." });
  }
});

// App routing and static middleware wrapper
async function boot() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite HMR
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production compiled static files server
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ERP Master Server running in container at http://0.0.0.0:${PORT}`);
  });
}

boot();
