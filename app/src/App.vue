<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div v-if="state == 0">
      <GenerateQuestions @questions-generated="onQuestionsGenerated" />
    </div>
    <div v-if="state == 1">
      <GameComponent :questions="questions" />
    </div>
  </div>
</template>

<script lang="ts">
import GenerateQuestions from './components/GenerateQuestions.vue'
import GameComponent from './components/Game.vue'

enum state {
  GENERATING_QUESTIONS,
  GAME,
}

type Question = {
  id: number
  question: string
  options: string[]
  correct: number
  explication: string
}

export default {
  name: 'App',
  components: {
    GameComponent,
    GenerateQuestions,
  },
  data() {
    return {
      state: state.GENERATING_QUESTIONS,
      questions: [] as Question[],
    }
  },
  methods: {
    onQuestionsGenerated(generatedQuestions: Question[]) {
      console.log('Questions reçues:', generatedQuestions)

      this.questions = generatedQuestions

      this.state = state.GAME
    },
  },
}
</script>
