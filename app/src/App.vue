<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div v-if="!isFinish" class="max-w-4xl mx-auto px-6">
      <!-- En-tête avec numéro de question -->
      <div class="text-center mb-8">
        <span
          class="inline-block bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold text-sm"
        >
          Question {{ questions[currentQuestionIndex].id }} / {{ questions.length }}
        </span>
      </div>

      <!-- Question principale -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 text-center leading-relaxed">
          {{ questions[currentQuestionIndex].question }}
        </h2>
      </div>

      <!-- Options de réponse -->
      <div class="space-y-4">
        <div
          v-for="(option, index) in questions[currentQuestionIndex].options"
          :key="index"
          @click="nextQuestion(index)"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-transparent hover:border-indigo-300"
        >
          <div class="p-6 flex items-center space-x-4">
            <div
              class="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center"
            >
              <span class="text-indigo-600 font-semibold">{{
                String.fromCharCode(65 + index)
              }}</span>
            </div>
            <p class="text-gray-700 text-lg flex-1">{{ option }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Page de résultats -->
    <div v-else class="max-w-4xl mx-auto px-6">
      <div class="text-center">
        <!-- Icône de fin -->
        <div class="mb-8">
          <div v-if="getScorePercentage >= 80" class="text-6xl">🎉</div>
          <div v-else-if="getScorePercentage >= 60" class="text-6xl">👍</div>
          <div v-else class="text-6xl">📚</div>
        </div>

        <!-- Titre -->
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Quiz terminé !</h1>

        <!-- Score principal -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div class="text-6xl font-bold mb-4" :class="getScoreColor">
            {{ goodResponse }} / {{ questions.length }}
          </div>
          <div class="text-2xl text-gray-600 mb-2">{{ getScorePercentage }}% de réussite</div>
          <div class="text-lg" :class="getScoreTextColor">
            {{ getScoreMessage }}
          </div>
        </div>

        <!-- Détails des résultats -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div class="text-green-600 text-3xl font-bold">{{ goodResponse }}</div>
            <div class="text-green-700 font-medium">Bonnes réponses</div>
          </div>
          <div class="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div class="text-red-600 text-3xl font-bold">{{ questions.length - goodResponse }}</div>
            <div class="text-red-700 font-medium">Erreurs</div>
          </div>
          <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div class="text-blue-600 text-3xl font-bold">{{ getScorePercentage }}%</div>
            <div class="text-blue-700 font-medium">Pourcentage</div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="space-y-4">
          <button
            @click="restartQuiz"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            🔄 Recommencer le quiz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
  data() {
    return {
      goodResponse: 0,
      currentQuestionIndex: 0,
      isFinish: false,
      questions: [
        {
          id: 1,
          question: "Qu'est-ce que l'overfitting en machine learning ?",
          options: [
            "Le modèle mémorise les données d'entraînement mais performe mal sur de nouvelles données",
            'Le modèle est trop simple',
            "Le modèle n'a pas assez de données",
            "Le modèle s'entraîne trop vite",
          ],
          correct: 0,
          explication:
            "L'overfitting (surajustement) se produit quand un modèle apprend trop spécifiquement les données d'entraînement, incluant le bruit, ce qui réduit sa capacité à généraliser sur de nouvelles données.",
        },
        {
          id: 2,
          question:
            "Quelle est la différence principale entre l'apprentissage supervisé et non supervisé ?",
          options: [
            "Le type d'algorithme utilisé",
            "La vitesse d'entraînement",
            "La présence ou absence de labels dans les données d'entraînement",
            'Le nombre de features utilisées',
          ],
          correct: 2,
          explication:
            "L'apprentissage supervisé utilise des données étiquetées (avec des réponses connues) pour apprendre, tandis que l'apprentissage non supervisé trouve des patterns dans des données sans étiquettes.",
        },
        {
          id: 3,
          question: 'Que mesure la précision (precision) en classification ?',
          options: [
            "L'erreur moyenne du modèle",
            'Le pourcentage de prédictions correctes sur toutes les prédictions',
            'Parmi les vrais positifs, combien ont été correctement identifiés',
            'Parmi les prédictions positives, combien sont vraiment positives',
          ],
          correct: 3,
          explication:
            "La précision = TP/(TP+FP). Elle indique, parmi toutes les prédictions positives du modèle, quelle proportion est réellement positive. Elle répond à 'Quand je dis oui, ai-je raison ?'",
        },
        {
          id: 4,
          question: 'À quoi sert la validation croisée (cross-validation) ?',
          options: [
            'À réduire le nombre de features',
            'À évaluer la performance du modèle de manière plus robuste',
            'À augmenter la taille du dataset',
            "À accélérer l'entraînement",
          ],
          correct: 1,
          explication:
            'La validation croisée divise les données en plusieurs plis (folds) pour entraîner et tester le modèle plusieurs fois, donnant une estimation plus fiable de ses performances.',
        },
        {
          id: 5,
          question: "Qu'est-ce qu'un réseau de neurones convolutif (CNN) ?",
          options: [
            'Un réseau qui utilise uniquement des connexions récurrentes',
            'Un réseau qui ne peut traiter que du texte',
            "Un réseau spécialisé dans le traitement d'images",
            'Un réseau sans couches cachées',
          ],
          correct: 2,
          explication:
            'Les CNNs utilisent des couches convolutives qui appliquent des filtres sur les images pour détecter des features locales (contours, formes). Ils sont particulièrement efficaces pour la vision par ordinateur.',
        },
        {
          id: 6,
          question: "Que fait l'algorithme de gradient descent ?",
          options: [
            'Il génère de nouvelles données',
            'Il classe les données en groupes',
            'Il sélectionne les meilleures features',
            'Il optimise les paramètres du modèle en minimisant la fonction de coût',
          ],
          correct: 3,
          explication:
            'Le gradient descent ajuste itérativement les paramètres du modèle dans la direction opposée au gradient pour minimiser la fonction de perte et améliorer les performances.',
        },
        {
          id: 7,
          question: "Qu'est-ce que le clustering en machine learning ?",
          options: [
            'Une technique de réduction de dimensionnalité',
            "Un moyen d'augmenter la taille du dataset",
            'Une méthode pour regrouper des données similaires sans labels',
            'Une technique de classification supervisée',
          ],
          correct: 2,
          explication:
            "Le clustering (K-means, DBSCAN, etc.) est une technique d'apprentissage non supervisé qui groupe automatiquement les données en clusters basés sur leur similitude.",
        },
        {
          id: 8,
          question: 'Que mesure le score F1 ?',
          options: [
            'La moyenne harmonique entre précision et rappel',
            "Le nombre d'erreurs du modèle",
            'La complexité computationnelle',
            "La vitesse d'exécution du modèle",
          ],
          correct: 0,
          explication:
            'Le score F1 = 2 × (précision × rappel)/(précision + rappel). Il combine précision et rappel en une seule métrique, utile quand on veut équilibrer les deux.',
        },
        {
          id: 9,
          question: "Qu'est-ce que la régularisation en machine learning ?",
          options: [
            'Une technique de visualisation',
            "Une méthode pour prévenir l'overfitting en ajoutant une pénalité aux paramètres complexes",
            'Un moyen de nettoyer les données',
            "Une technique pour accélérer l'entraînement",
          ],
          correct: 1,
          explication:
            "La régularisation (L1, L2, dropout) ajoute une pénalité au modèle pour limiter sa complexité et réduire l'overfitting. Elle force le modèle à rester plus simple et généralisable.",
        },
        {
          id: 10,
          question: 'Quelle est la différence entre un paramètre et un hyperparamètre ?',
          options: [
            'Les hyperparamètres sont plus importants',
            "Il n'y a pas de différence",
            'Les paramètres ne changent jamais',
            'Les paramètres sont appris automatiquement, les hyperparamètres sont définis manuellement',
          ],
          correct: 3,
          explication:
            "Les paramètres (poids, biais) sont appris automatiquement pendant l'entraînement. Les hyperparamètres (learning rate, nombre d'epochs, architecture) sont définis avant l'entraînement et contrôlent le processus d'apprentissage.",
        },
      ],
    }
  },
  computed: {
    getScorePercentage() {
      return Math.round((this.goodResponse / this.questions.length) * 100)
    },
    getScoreColor() {
      const percentage = this.getScorePercentage
      if (percentage >= 80) return 'text-green-600'
      if (percentage >= 60) return 'text-yellow-600'
      return 'text-red-600'
    },
    getScoreTextColor() {
      const percentage = this.getScorePercentage
      if (percentage >= 80) return 'text-green-700'
      if (percentage >= 60) return 'text-yellow-700'
      return 'text-red-700'
    },
    getScoreMessage() {
      const percentage = this.getScorePercentage
      if (percentage >= 90) return 'Excellent ! Vous maîtrisez parfaitement le sujet ! 🌟'
      if (percentage >= 80) return 'Très bien ! Vous avez une bonne compréhension ! 👏'
      if (percentage >= 70) return 'Bien joué ! Quelques révisions et ce sera parfait ! 📈'
      if (percentage >= 60) return 'Pas mal ! Continuez à étudier pour vous améliorer ! 💪'
      if (percentage >= 50) return 'Il faut réviser un peu plus ! Courage ! 📖'
      return 'Ne vous découragez pas, la pratique mène à la perfection ! 🎯'
    },
  },
  methods: {
    nextQuestion(index: number) {
      console.log('Option sélectionnée:', index)
      if (index === this.questions[this.currentQuestionIndex].correct) {
        this.goodResponse++
      }
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++
      } else {
        this.isFinish = true
      }
    },
    restartQuiz() {
      this.currentQuestionIndex = 0
      this.goodResponse = 0
      this.isFinish = false
    },
    async generateQuestions(topic: string, difficulty: string, numberOfQuestions: number) {
      const response = await fetch('http://localhost:3001/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          difficulty: difficulty,
          numberOfQuestions: numberOfQuestions,
        }),
      })

      const data = await response.json()
      return data.questions
    },
  },
}
</script>
