<script setup>
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/sessionStore';
import { usePhotoStore } from '../stores/photoStore';
import { onMounted, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid'
import { saveSubmission } from '../services/indexesdb';
import { getSession, updateSession } from '../services/supabase/bucket';

const router = useRouter()
const sessionStore= useSessionStore()
const photoStore = usePhotoStore()
const bucket = ref(null)
const sessionCount = ref()

function goHome(){
    sessionStore.resetSession()
    router.push('/')
}

onMounted(() => {
    console.log(`tutorial ${useSessionStore().eventName}`)

    if (sessionStore.step!=='tutorial'){
        goHome()
        return
    }
})

async function startEvent(){
    const time = new Date().toISOString()
    const setId = uuidv4()
    photoStore.setCreated(time)
    photoStore.setCurrentSubmissionId(setId)

    let session = await getSession()

    if (!session) {
        await updateSession({ id: 1, bucket: 'photos_1', session: 1 })
        session = await getSession()
    } else {
        session.session = (session.session || 0) + 1
        await updateSession({ session: session.session })
    }
    sessionCount.value = session.session
    const bucketNumber = Math.floor((session.session - 1) / 5) + 1
    const limitedBucketNumber = Math.min(bucketNumber, 20)
    const finalBucket = `photos_${limitedBucketNumber}`

    await updateSession({ bucket: finalBucket })

    bucket.value = finalBucket
    photoStore.setBucket(finalBucket)

    await saveSubmission({
        id: setId, 
        created_at: time, 
        event_name : sessionStore.eventName,
        selected_frame : null, 
        raw_photos: null,
        selected_filter : null, 
        filtered_photos : null, 
        final_photo: null, 
        emailed : false, 
        printed: false, 
        bucket_name : finalBucket 
    })
    console.log(bucket.value)
    console.log(sessionCount.value)
    sessionStore.setStep('frame')
    router.push('/frame')
}

</script>
<template>
    <div class="h-dvh w-full  flex flex-col overflow-hidden text-font bg-bg ">
        <div class="flex flex-row mt-1">
        <i class="pi pi-times text-font text-xl m-2" @click="goHome"></i>
        <i class="pi pi-arrow-right text-font text-2xl ml-auto mr-7 mt-2" @click="startEvent"></i>
    </div>
    </div>
</template>



