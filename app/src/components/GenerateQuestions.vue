<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <!-- Titre -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Générateur de Quiz</h1>
        <p class="text-gray-600">Créez votre quiz personnalisé</p>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Sujet -->
        <div>
          <label for="topic" class="block text-sm font-semibold text-gray-700 mb-2">
            📚 Sujet du quiz
          </label>
          <input
            id="topic"
            v-model="formData.topic"
            type="text"
            placeholder="Ex: Machine Learning, JavaScript, Histoire..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <!-- Difficulté -->
        <div>
          <label for="difficulty" class="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Niveau de difficulté
          </label>
          <select
            id="difficulty"
            v-model="formData.difficulty"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
          >
            <option value="">Sélectionnez un niveau</option>
            <option value="facile">🟢 Facile</option>
            <option value="moyen">🟡 Moyen</option>
            <option value="difficile">🔴 Difficile</option>
          </select>
        </div>

        <!-- Langue -->
        <div>
          <label for="language" class="block text-sm font-semibold text-gray-700 mb-2">
            🌍 Langue du quiz
          </label>
          <select
            id="language"
            v-model="formData.language"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
          >
            <option value="">Sélectionnez une langue</option>
            <option value="français">🇫🇷 Français</option>
            <option value="anglais">🇬🇧 Anglais</option>
            <option value="espagnol">🇪🇸 Espagnol</option>
            <option value="italien">🇮🇹 Italien</option>
            <option value="allemand">🇩🇪 Allemand</option>
          </select>
        </div>

        <!-- Nombre de questions -->
        <div>
          <label for="numberOfQuestions" class="block text-sm font-semibold text-gray-700 mb-2">
            🔢 Nombre de questions
          </label>
          <select
            id="numberOfQuestions"
            v-model="formData.numberOfQuestions"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
          >
            <option value="">Choisissez le nombre</option>
            <option value="5">5 questions</option>
            <option value="10">10 questions</option>
            <option value="15">15 questions</option>
            <option value="20">20 questions</option>
          </select>
        </div>

        <!-- Bouton de génération -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="!isLoading" class="flex items-center justify-center">
            ✨ Générer le quiz
          </span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Génération en cours...
          </span>
        </button>
      </form>

      <!-- Séparateur -->
      <div class="my-8 flex items-center">
        <div class="flex-1 border-t border-gray-300"></div>
        <span class="px-4 text-gray-500 text-sm font-medium">OU</span>
        <div class="flex-1 border-t border-gray-300"></div>
      </div>

      <!-- Section de chargement de quiz -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-800 text-center">📂 Charger un quiz existant</h3>

        <!-- Input file caché -->
        <input ref="fileInput" type="file" accept=".json" @change="handleFileLoad" class="hidden" />

        <!-- Bouton de chargement -->
        <button
          @click="triggerFileInput"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span class="flex items-center justify-center"> 📥 Charger un quiz (JSON) </span>
        </button>
      </div>

      <!-- Message de succès -->
      <div v-if="successMessage" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-700 text-sm">✅ {{ successMessage }}</p>
      </div>

      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 text-sm">❌ {{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
interface Question {
  id?: number
  question: string
  options: string[]
  correct: number
  explication?: string
}

interface QuizData {
  metadata?: {
    title?: string
    totalQuestions?: number
    score?: string
    percentage?: string
    dateGenerated?: string
  }
  questions?: Question[]
}

export default {
  name: 'GenerateQuestionsComponent',
  data() {
    return {
      formData: {
        topic: '',
        difficulty: '',
        language: '',
        numberOfQuestions: '',
      },
      isLoading: false,
      errorMessage: '',
      successMessage: '',
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.isLoading = true
        this.errorMessage = ''

        console.log('Génération des questions...', this.formData)

        // Appeler la méthode de génération
        await this.generateQuestions(
          this.formData.topic,
          this.formData.difficulty,
          this.formData.language,
          parseInt(this.formData.numberOfQuestions),
        )
      } catch (error) {
        console.error('Erreur lors de la génération:', error)
        this.errorMessage =
          'Une erreur est survenue lors de la génération des questions. Veuillez réessayer.'
      } finally {
        this.isLoading = false
      }
    },

    async generateQuestions(
      topic: string,
      difficulty: string,
      language: string,
      numberOfQuestions: number,
    ) {
      const response = await fetch('http://localhost:3001/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          difficulty: difficulty,
          language: language,
          numberOfQuestions: numberOfQuestions,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()

      // 🎯 Émettre l'événement vers le parent avec les questions
      this.$emit('questions-generated', data.questions)

      return data.questions
    },

    // 🎯 Déclencher la sélection de fichier
    triggerFileInput() {
      this.clearMessages()
      const fileInput = this.$refs.fileInput as HTMLInputElement
      fileInput.click()
    },

    // 🎯 Gérer le chargement du fichier JSON
    async handleFileLoad(event: Event) {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      try {
        this.isLoading = true
        this.clearMessages()

        // Vérifier que c'est un fichier JSON
        if (!file.name.toLowerCase().endsWith('.json')) {
          throw new Error('Veuillez sélectionner un fichier JSON (.json)')
        }

        // Lire le fichier
        const fileContent = (await this.readFile(file)) as string

        // Parser le JSON
        const quizData = JSON.parse(fileContent)

        // Valider le format du JSON
        this.validateQuizData(quizData)

        // Extraire les questions
        const questions = Array.isArray(quizData)
          ? quizData
          : (quizData as QuizData).questions || []

        // Émettre les questions vers le parent
        this.$emit('questions-generated', questions)

        this.successMessage = `Quiz chargé avec succès ! ${questions.length} questions trouvées.`

        // Réinitialiser l'input file
        target.value = ''
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        this.errorMessage =
          error instanceof Error ? error.message : 'Erreur lors du chargement du fichier'
      } finally {
        this.isLoading = false
      }
    },

    // 🎯 Lire le contenu du fichier
    readFile(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }

        reader.onerror = () => {
          reject(new Error('Erreur lors de la lecture du fichier'))
        }

        reader.readAsText(file)
      })
    },

    // 🎯 Valider le format des données du quiz
    validateQuizData(data: QuizData | Question[]) {
      // Si c'est un objet avec metadata, prendre les questions
      const questions = Array.isArray(data) ? data : (data as QuizData).questions || []

      if (!Array.isArray(questions)) {
        throw new Error('Le fichier JSON ne contient pas un tableau de questions valide')
      }

      if (questions.length === 0) {
        throw new Error('Le fichier JSON ne contient aucune question')
      }

      // Vérifier que chaque question a la structure attendue
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i]

        if (!question.question || typeof question.question !== 'string') {
          throw new Error(`Question ${i + 1}: Texte de question manquant ou invalide`)
        }

        if (!Array.isArray(question.options) || question.options.length < 2) {
          throw new Error(`Question ${i + 1}: Options manquantes ou insuffisantes`)
        }

        if (
          typeof question.correct !== 'number' ||
          question.correct < 0 ||
          question.correct >= question.options.length
        ) {
          throw new Error(`Question ${i + 1}: Index de réponse correcte invalide`)
        }
      }
    },

    // 🎯 Effacer les messages
    clearMessages() {
      this.errorMessage = ''
      this.successMessage = ''
    },
  },
}
</script>
