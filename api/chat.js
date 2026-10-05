import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'يسمح بطلبات POST فقط' });
    }

    const { message } = req.body;

    if (!message) {
         return res.status(400).json({ error: 'الرسالة فارغة' });
    }

    // إعداد مزود الخدمة باستخدام المفتاح السري الموجود في بيئة Vercel
    const provider = createOpenAICompatible({
        name: "cheaper-inference", 
        baseURL: "https://api.cheaperinference.com/v1", 
        apiKey: process.env.CHEAPER_INFERENCE_API_KEY,
    });

    try {
        // توليد الرد باستخدام نموذج aion-3.0
        const result = await generateText({
            model: provider.chatModel("aion-3.0"),
            prompt: message,
            maxOutputTokens: 1000,
        });

        // إرجاع النص كـ JSON
        res.status(200).json({ reply: result.text });
    } catch (error) {
        console.error("API Error Details:", error);
        res.status(500).json({ error: 'فشل في الاتصال بمزود الذكاء الاصطناعي' });
    }
}
