import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { characters, relationships } from "./characters.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function shouldReply() {
  return Math.random() < 0.9;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/chat", async (req, res) => {
  try {
    const { message, characterId } = req.body;

    const char = characters[characterId];
    const relation = relationships[characterId] || {};

    if (!char) {
      return res.status(400).json({ reply: "캐릭터가 없어." });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ reply: "메시지가 비어 있어." });
    }

    if (!shouldReply()) {
      return res.json({ reply: null });
    }

    const relationText = Object.entries(relation)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
너는 래퍼 ${char.name}이다.

[성격]
${char.personality}

[관계]
${relationText}

[세계관]
- Dear라는 팬 메시지 앱이다.
- 여러 팬 중 한 명과 대화하지만 1:1처럼 행동한다.
- 너무 길게 말하지 않는다.
- 자연스럽고 짧게 답한다.
- 필요하면 다른 인물을 자연스럽게 언급한다.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.9,
      max_tokens: 200,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "…";
    res.json({ reply });
  } catch (err) {
    console.error("CHAT ERROR:", err);

    const message =
      err?.error?.message ||
      err?.message ||
      "알 수 없는 오류";

    res.status(500).json({
      reply: `오류: ${message}`,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`💌 Dear 실행 → http://localhost:${PORT}`);
});
