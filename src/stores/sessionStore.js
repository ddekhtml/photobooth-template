import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    eventId : "merkico",
    eventName: "Merkico",
    eventDate: null,
    step: 'home',      
  }),

  actions: {
    setEvent(id, name, date) {
      this.eventId= id
      this.eventName = name
      this.eventDate = date
    },

    setStep(step) {
      this.step = step
    },
    resetSession() {
      this.step = 'home'
    },
  }
})
