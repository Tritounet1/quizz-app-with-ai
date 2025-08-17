<template>
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
            <span class="text-indigo-600 font-semibold">{{ String.fromCharCode(65 + index) }}</span>
          </div>
          <p class="text-gray-700 text-lg flex-1">{{ option }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal d'explication -->
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <!-- Overlay avec fond transparent -->
    <div class="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

    <!-- Modal Content -->
    <div
      class="relative bg-white/95 backdrop-blur-md w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl border border-white/20 transform transition-all duration-300 ease-in-out"
      :class="showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
    >
      <!-- Header de la modal -->
      <div
        class="p-6 text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-3xl border-b border-gray-100"
      >
        <div class="text-4xl mb-2">
          {{ isCorrectAnswer ? '🎉' : '🤔' }}
        </div>
        <h3 class="text-2xl font-bold" :class="isCorrectAnswer ? 'text-green-700' : 'text-red-700'">
          {{ isCorrectAnswer ? 'Excellent !' : 'Pas tout à fait...' }}
        </h3>
        <p class="text-sm text-gray-600 mt-1">
          {{ isCorrectAnswer ? 'Bonne réponse !' : 'Voyons la correction' }}
        </p>
      </div>

      <!-- Contenu de la modal -->
      <div class="p-6">
        <!-- Question -->
        <div class="mb-6 p-4 bg-gray-50 rounded-xl">
          <h4 class="font-semibold text-indigo-700 mb-3 flex items-center">
            <span class="text-lg mr-2">❓</span>
            Question :
          </h4>
          <p class="text-gray-700 text-lg leading-relaxed">{{ currentQuestion?.question }}</p>
        </div>

        <!-- Réponse sélectionnée -->
        <div class="mb-6">
          <h4 class="font-semibold text-gray-700 mb-3 flex items-center">
            <span class="text-lg mr-2">👤</span>
            Votre réponse :
          </h4>
          <div
            class="p-4 rounded-xl border-2 shadow-sm"
            :class="
              isCorrectAnswer
                ? 'bg-green-50 border-green-300 shadow-green-100'
                : 'bg-red-50 border-red-300 shadow-red-100'
            "
          >
            <div class="flex items-center">
              <span
                class="font-bold text-xl mr-3 w-8 h-8 rounded-full flex items-center justify-center text-white"
                :class="isCorrectAnswer ? 'bg-green-500' : 'bg-red-500'"
              >
                {{ String.fromCharCode(65 + selectedAnswerIndex) }}
              </span>
              <span class="text-gray-800 font-medium">{{ selectedAnswerText }}</span>
            </div>
          </div>
        </div>

        <!-- Bonne réponse (si incorrecte) -->
        <div v-if="!isCorrectAnswer" class="mb-6">
          <h4 class="font-semibold text-gray-700 mb-3 flex items-center">
            <span class="text-lg mr-2">✅</span>
            Bonne réponse :
          </h4>
          <div
            class="p-4 rounded-xl bg-green-50 border-2 border-green-300 shadow-sm shadow-green-100"
          >
            <div class="flex items-center">
              <span
                class="font-bold text-xl mr-3 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"
              >
                {{ String.fromCharCode(65 + currentQuestion.correct) }}
              </span>
              <span class="text-gray-800 font-medium">{{
                currentQuestion?.options[currentQuestion.correct]
              }}</span>
            </div>
          </div>
        </div>

        <!-- Explication -->
        <div class="mb-6">
          <h4 class="font-semibold text-gray-700 mb-3 flex items-center">
            <span class="text-lg mr-2">💡</span>
            Explication :
          </h4>
          <div
            class="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-r-xl shadow-sm"
          >
            <p class="text-gray-700 leading-relaxed text-lg">
              {{ currentQuestion?.explication }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer avec bouton -->
      <div
        class="p-6 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-b-3xl border-t border-gray-100"
      >
        <button
          @click="continueToNext"
          class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span class="text-lg">
            {{ isLastQuestion ? '🏁 Voir les résultats' : '➡️ Question suivante' }}
          </span>
        </button>
      </div>
    </div>
  </div>

  <!-- Page de résultats -->
  <div v-else-if="isFinish" class="max-w-4xl mx-auto px-6">
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

        <!-- Boutons de téléchargement -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="downloadQuizAsJSON"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            💾 Télécharger (JSON)
          </button>
          <button
            @click="downloadQuizAsText"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            📄 Télécharger (Texte)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
type Question = {
  id: number
  question: string
  options: string[]
  correct: number
  explication: string
}

export default {
  name: 'GameComponent',
  props: {
    questions: {
      type: Array as () => Question[],
      required: true,
    },
  },
  data() {
    return {
      goodResponse: 0,
      currentQuestionIndex: 0,
      isFinish: false,
      showModal: false,
      selectedAnswerIndex: -1,
      isCorrectAnswer: false,
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
    currentQuestion() {
      return this.questions[this.currentQuestionIndex]
    },
    selectedAnswerText() {
      return this.currentQuestion?.options[this.selectedAnswerIndex] || ''
    },
    isLastQuestion() {
      return this.currentQuestionIndex >= this.questions.length - 1
    },
  },
  methods: {
    nextQuestion(index: number) {
      console.log('Option sélectionnée:', index)

      // Stocker les informations de la réponse
      this.selectedAnswerIndex = index
      this.isCorrectAnswer = index === this.questions[this.currentQuestionIndex].correct

      // Incrémenter le score si correct
      if (this.isCorrectAnswer) {
        this.goodResponse++
      }

      // Afficher la modal
      this.showModal = true
    },
    restartQuiz() {
      this.currentQuestionIndex = 0
      this.goodResponse = 0
      this.isFinish = false
      this.showModal = false
      this.selectedAnswerIndex = -1
      this.isCorrectAnswer = false
    },

    // 🎯 Continuer vers la prochaine question ou afficher les résultats
    continueToNext() {
      this.showModal = false

      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++
      } else {
        this.isFinish = true
      }

      // Réinitialiser les données de la modal
      this.selectedAnswerIndex = -1
      this.isCorrectAnswer = false
    },
    downloadQuizAsJSON() {
      const quizData = {
        metadata: {
          title: 'Quiz Personnalisé',
          totalQuestions: this.questions.length,
          score: `${this.goodResponse}/${this.questions.length}`,
          percentage: `${this.getScorePercentage}%`,
          dateGenerated: new Date().toISOString(),
        },
        questions: this.questions,
      }

      const dataStr = JSON.stringify(quizData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `quiz-${new Date().toISOString().split('T')[0]}.json`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(link.href)
    },

    downloadQuizAsText() {
      let textContent = `QUIZ PERSONNALISÉ\n`
      textContent += `================\n\n`
      textContent += `Score: ${this.goodResponse}/${this.questions.length} (${this.getScorePercentage}%)\n`
      textContent += `Date: ${new Date().toLocaleDateString('fr-FR')}\n\n`

      this.questions.forEach((question, index) => {
        textContent += `${index + 1}. ${question.question}\n\n`

        question.options.forEach((option, optIndex) => {
          const letter = String.fromCharCode(65 + optIndex)
          const isCorrect = optIndex === question.correct ? ' ✓' : ''
          textContent += `   ${letter}) ${option}${isCorrect}\n`
        })

        textContent += `\n   Explication: ${question.explication}\n\n`
        textContent += `${'='.repeat(50)}\n\n`
      })

      const dataBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `quiz-${new Date().toISOString().split('T')[0]}.txt`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(link.href)
    },
  },
}
</script>
