import { defineStore } from 'pinia'

export const usePhotoStore = defineStore('photo', {
  state: () => ({
    selectedFrame: null,
    rawPhotos: [], 
    selectedFilter: {
        id: 'normal',
        name: 'Normal',
        css: ''
    },
    filteredPhoto: [],
    currentSubmissionId : null, 
    created: null,
    bucket_id : null,
  }),

  actions: {
    setFrame(frame) {
      this.selectedFrame = frame
      this.rawPhotos = []
    },
    addRawPhoto(photo) {
      this.rawPhotos.push(photo)
    },
    setFilter(filter) {
      this.selectedFilter = filter
    },
    resetAll() {
      this.selectedFrame = null
      this.rawPhotos = []
      this.selectedFilter = null
      this.currentSubmissionId= null
      this.filteredPhoto = []
      this.created= null 
    }, 
    setFilteredPhotos(photo) {
      this.filteredPhoto = photo
    }, 
    resetRawPhotos(){
      this.rawPhotos=[]
    }, 
    setCurrentSubmissionId(id){
      this.currentSubmissionId= id 
    },
    setCreated(param){
      this.created= param 
    },
    setBucket(bucket){
      this.bucket_id= bucket
    }
  }
})
