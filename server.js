const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

app.post('/api/tarot', async (req, res) => {
    try {
        const { pergunta, cartas } = req.body; 
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // PROMPT CORRIGIDO: Retiramos o pedido da oração daqui. A IA agora foca 100% na leitura.
        const textoPrompt = `Você é um tarólogo místico e sábio. 
O consulente perguntou: "${pergunta}". 
As cartas tiradas pelo destino foram: ${cartas.join(', ')}. 

Sua tarefa: Interprete o significado dessas cartas de forma profunda, poética e mística para responder à pergunta. Vá direto à interpretação sem repetições desnecessárias. Responda em português do Brasil (PT-BR).`;

        const result = await model.generateContent(textoPrompt);
        const respostaIA = result.response.text();

        res.json({ resposta: respostaIA });
        
    } catch (error) {
        console.error("Erro detalhado do Google Gemini:", error);
        res.status(500).json({ erro: "As energias estão turvas no momento. O Oráculo não pôde se conectar." });
    }
});

app.listen(port, () => {
    console.log(`🔮 Servidor místico do Tarot está rodando!`);
    console.log(`Acesse o seu site em: http://localhost:${port}`);
});
