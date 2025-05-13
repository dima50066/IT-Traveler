<script setup>
import { ref, watch } from 'vue'
import IButton from '../../shared/IButton/IButton.vue'
import IInput from '../../shared/IInput/IInput.vue'
import IModal from '../../shared/IModal/IModal.vue'
import InputImage from '../../shared/InputImage/InputImage.vue'
import MarkerIcon from '../../shared/icons/MarkerIcon.vue'
import fallbackImage from '../../assets/img/ukraine.png'

const props = defineProps({
    isOpen: { default: false, type: Boolean },
    place: { type: Object, default: null },
    isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
    title: '',
    description: '',
    img: ''
})

watch(
    () => props.place,
    (newPlace) => {
        if (newPlace) {
            form.value = {
                title: newPlace.title,
                description: newPlace.description,
                img: newPlace.img || ''
            }
        }
    },
    { immediate: true }
)

const handleSubmit = () => {
    if (!props.place) return;

    const payload = {
        id: props.place.id || props.place._id,
        coordinates: props.place.coordinates,
        ...form.value
    }

    emit('submit', payload)
}
</script>

<template>
    <IModal v-if="props.isOpen" @close="emit('close')">
        <div class="w-[750px]">
            <div class="flex gap-2 items-center mb-10">
                <MarkerIcon height="18" width="18" />
                <span class="font-bold text-base">Редагувати маркер</span>
            </div>

            <form @submit.prevent="handleSubmit">
                <div class="flex gap-5">
                    <div class="w-5/12">
                        <img class="w-full h-[276px] object-cover rounded-md" :src="form.img || fallbackImage"
                            alt="place img" />
                    </div>

                    <div class="w-7/12">
                        <IInput label="Локація" v-model="form.title" />
                        <div class="mt-4">
                            <IInput label="Опис" type="textarea" v-model="form.description" />
                        </div>
                        <IButton class="mt-10 w-full" variant="gradient" :disabled="props.isLoading">
                            Зберегти
                        </IButton>
                    </div>
                </div>

                <InputImage class="mt-3" @update="form.img = $event">
                    <span class="text-xs">Натисніть тут, щоб додати інше фото</span>
                </InputImage>
            </form>
        </div>
    </IModal>
</template>
