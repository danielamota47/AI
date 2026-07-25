//Backend simples: recebe pedidos do frontend e chama a API da Anthropic.
//A chave da API fica só aqui no servidor, nunca no browser.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static("public"));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

//Endpoint principal: pergunta simples (usado pelo botão "Ask")
app.post("/api/chat", async (req, res) => {
    try {
        const { question, context } = req.body;

        if (!question || typeof question !== "string") {
            return res.status(400).json({ error: "Campo 'question' em falta ou inválido."});
        }

        // 'context' é opcional: texto extraído de um documento carregado (próximo passo)
        const systemPrompt = context
            ? `Responde com base apenas no seguinte documento:\n\n${context}`
            : "És um assistente que ajuda a analisar documentos e responder a perguntas.";

        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-5",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: question }],
        });

        const answer = message.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("\n");

        res.json({ answer });

    } catch (err) {
        console.error("Erro ao chamar a API da Anthropic:", err);
        res.status(500).json({ error: "Erro ao processar o pedido." });
    }
});

//Endpoint de "saúde", útil para testar se o servidor está a correr
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});