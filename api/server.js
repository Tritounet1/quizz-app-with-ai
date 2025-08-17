import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "Serveur Express + Anthropic API est en marche !" });
});

// Route POST pour appeler l'API Anthropic
app.post("/api/chat", async (req, res) => {
  try {
    const { message, maxTokens = 1024 } = req.body;

    // Validation des données
    if (!message) {
      return res.status(400).json({
        error: 'Le champ "message" est requis',
      });
    }

    // Appel à l'API Anthropic
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: maxTokens,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Retourner la réponse
    res.json({
      success: true,
      response: response.content[0].text,
      usage: response.usage,
    });
  } catch (error) {
    console.error("Erreur API Anthropic:", error);

    // Gestion des différents types d'erreurs
    if (error.status === 401) {
      return res.status(401).json({
        error: "Clé API invalide",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: "Limite de requêtes atteinte",
      });
    }

    res.status(500).json({
      error: "Erreur interne du serveur",
      details: error.message,
    });
  }
});

// Route POST pour générer des questions de quiz
app.post("/api/generate-questions", async (req, res) => {
  try {
    const {
      topic,
      difficulty = "moyen",
      language = "français",
      numberOfQuestions = 5,
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: 'Le champ "topic" est requis',
      });
    }

    const prompt = `Génère ${numberOfQuestions} questions de quiz sur le sujet "${topic}" avec un niveau de difficulté ${difficulty}.

IMPORTANT : 
- Les questions et réponses doivent être en ${language}
- Pour chaque question, MÉLANGE ALÉATOIREMENT l'ordre des options de réponse
- La bonne réponse ne doit PAS toujours être en première position
- Assure-toi que l'index "correct" correspond bien à la position de la bonne réponse après mélange
- RESPECTE EXACTEMENT les noms de champs du JSON (en français), ne les traduis JAMAIS

Format JSON requis (noms de champs OBLIGATOIRES en français) :
{
  "questions": [
    {
      "id": 1,
      "question": "Question ici",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 2,
      "explication": "Explication détaillée de la réponse"
    }
  ]
}

RÈGLES STRICTES :
- Varie l'index de la bonne réponse (0, 1, 2, 3) de manière aléatoire
- Les explications doivent être claires et éducatives
- Les mauvaises réponses doivent être plausibles mais clairement incorrectes
- Assure-toi que chaque question a exactement 4 options
- UTILISE TOUJOURS "explication" (pas "explanation" ou autre traduction)
- UTILISE TOUJOURS "question" (pas "question" traduit)
- UTILISE TOUJOURS "options" (pas "choices" ou autre)
- UTILISE TOUJOURS "correct" (pas "answer" ou autre)`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    try {
      const generatedQuestions = JSON.parse(response.content[0].text);
      res.json({
        success: true,
        questions: generatedQuestions.questions,
      });
    } catch (parseError) {
      console.log("parseError : ", parseError);
      res.status(500).json({
        error: "Erreur lors du parsing des questions générées",
        rawResponse: response.content[0].text,
      });
    }
  } catch (error) {
    console.error("Erreur génération questions:", error);
    res.status(500).json({
      error: "Erreur lors de la génération des questions",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📡 API Anthropic prête !`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      "ANTHROPIC_API_KEY non définie dans les variables d'environnement"
    );
  }
});
