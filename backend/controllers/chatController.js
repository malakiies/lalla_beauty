import OpenAI from 'openai';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Handle chat messages
// @route   POST /api/chat
export const handleChatMessage = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    res.status(500);
    throw new Error("Clé API OpenAI non configurée sur le serveur.");
  }

  // Initialiser OpenAI (OpenRouter configuration si la clé commence par sk-or-)
  const isOpenRouter = process.env.OPENAI_API_KEY.startsWith('sk-or-');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: isOpenRouter ? "https://openrouter.ai/api/v1" : undefined,
  });

  const modelName = isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini";

  // Récupérer les produits pour que l'IA connaisse le catalogue
  const products = await Product.find({}).select('name category price description');
  const productList = products.map(p => `- ${p.name} (${p.price} MAD): ${p.description}`).join('\n');

  const systemInstruction = `Tu es "Lalla", l'assistante beauté experte et chaleureuse de la boutique en ligne "Lalla Beauty" située au Maroc.
Tu dois toujours répondre en français.
Ton rôle est de :
1. Conseiller les clientes sur leurs problèmes de peau (skincare), de maquillage ou de cheveux.
2. Créer des routines beauté personnalisées.
3. Recommander des produits du catalogue de Lalla Beauty.

Voici la liste exacte des produits disponibles dans la boutique actuellement :
${productList}

Règles strictes :
- Ne recommande JAMAIS un produit qui n'est pas dans la liste ci-dessus. Si tu n'as pas de produit exact pour un besoin, donne des conseils naturels ou suggère de revenir plus tard.
- Sois très polie, utilise un ton amical, utilise des emojis (✨, 💖, 🌸).
- Ne réponds pas aux questions qui n'ont rien à voir avec la beauté, les cosmétiques, ou la boutique Lalla Beauty. Si on te demande autre chose, dis poliment que ton domaine d'expertise est la beauté.
- Fais des réponses concises, claires et bien formatées en markdown.`;

  try {
    const formattedHistory = history ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text
    })) : [];

    const messages = [
      { role: 'system', content: systemInstruction },
      { role: 'assistant', content: 'Compris ! Je suis Lalla, ton assistante beauté. Comment puis-je t\'aider ? ✨' },
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: modelName,
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;

    res.json({ text });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500);
    throw new Error("Désolé, l'assistante beauté est temporairement indisponible.");
  }
});
