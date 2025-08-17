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
  },
}
</script>
