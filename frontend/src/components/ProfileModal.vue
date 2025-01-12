<template>
    <div class="profile__overlay" @click="$emit('close')">
        <div class="profile" @click.stop>
            <button class="profile__close" @click="$emit('close')">
                <img src="../assets/user-cancel.svg" alt="">
            </button>
            <div class="profile__content">
                <span class="profile__content__title">Информация о вас</span>
                <div class="profile__content__image">
                    <img :src="userInfo.avatarUrl || '../assets/default-avatar.png'" alt="Avatar">
                    <div class="profile__content__image__overlay">
                        <input type="file" @change="onFileChange" />
                    </div>
                </div>
                <div class="profile__content__name">
                    <span>Имя</span>
                    <span @click="openNameModal">{{ userInfo.username }}</span>
                </div>
                <div class="profile__content__desc">
                    <span>Описание</span>
                    <span v-if="!userInfo.description || userInfo.description.trim() === ''" @click="openDescModal">Напишите немного о себе</span>
                    <span v-else @click="openDescModal">{{ userInfo.description }}</span>
                </div>
            </div>
        </div>
    </div>
    <NameModal
        v-if="isNameModalVisible"
        @close-name-modal="closeNameModal"
    />
    <DescModal
        v-if="isDescModalVisible"
        @close-desc-modal="closeDescModal"
    />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NameModal from './NameModal.vue';
import DescModal from './DescModal.vue';
import axios from 'axios';

const userId = localStorage.getItem('userId')
const isNameModalVisible = ref(false)
const isDescModalVisible = ref(false)

const openNameModal = () => {
    isNameModalVisible.value = true
}

const closeNameModal = () => {
    isNameModalVisible.value = false
}

const openDescModal = () => {
    isDescModalVisible.value = true
}
const closeDescModal = () => {
    isDescModalVisible.value = false
}

const userInfo = ref({
    username: '',
    description: '',
    avatarUrl: ''
})

const fetchUserInfo = async() => {
    try {
        const response = await axios.get(`https://backzhirnow.ru.tuna.am/api/users/${userId}/info`)

        const { description, avatarUrl, username } = response.data
        userInfo.value = { description, avatarUrl, username }
    } catch (error) {
        console.error('Ошибка при получении информации о пользователе:', error)
    }
}

const onFileChange = async (e: Event) => {
    const fileInput = e.target as HTMLInputElement
    if (fileInput?.files?.length) {
        const formData = new FormData()
        formData.append('avatar', fileInput.files[0])

        try {
            const response = await axios.post(`https://backzhirnow.ru.tuna.am/api/users/${userId}/upload-avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            userInfo.value.avatarUrl = response.data.avatarUrl
            fetchUserInfo()
        } catch (error) {
            console.error('Ошибка при загрузке аватара:', error)
        }
    }
}

onMounted(() => {
    fetchUserInfo()
})
</script>
<style scoped>
.profile__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.profile{
    width: 400px;
    height: 45%;
    position: absolute;
    top: 27vh;
    left: 57vh;
    background: #fff;
    border-radius: 20px;
    z-index: 2;
    .profile__close{
        background: none;
        border: none;
        margin-left: 20px auto;
        position: relative;
        top: 1.5vh;
        left: 40vh;
        cursor: pointer;
    }
}
.profile__content{
    width: 90%;
    margin: auto;
    text-align: center;
    .profile__content__title{
        font-size: 28px;
    }
    .profile__content__image{
        position: relative;
        width: 120px;
        height: 120px;
        border: 1px solid #E1E1E1;
        border-radius: 50%;
        margin: 20px auto;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .profile__content__image__overlay{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;
    }
    .profile__content__image__overlay:hover {
        opacity: 1;
    }
    .profile__content__image__overlay::before {
        content: "Загрузить фото";
        color: #fff;
        font-size: 14px;
        text-align: center;
        pointer-events: none;
    }
    .profile__content__image__overlay input[type="file"] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    .profile__content__name,
    .profile__content__desc{
        margin: 20px auto;
        color: #909090;
    }

    .profile__content__name span:first-child,
    .profile__content__desc span:first-child{
        display: block;
        font-size: 20px;
        margin-bottom: 5px;
        color: #000;
    }
    .profile__content__name span:last-child,
    .profile__content__desc span:last-child{
        cursor: pointer;
    }
}
</style>