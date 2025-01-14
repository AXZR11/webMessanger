<template>
    <div class="profile__overlay" @click="$emit('close-user-modal')">
        <div class="profile" @click.stop>
            <button class="profile__close" @click="$emit('close-user-modal')">
                <img src="../assets/user-cancel.svg" alt="">
            </button>
            <div class="profile__content">
                <span class="profile__content__title">Информация о вас</span>
                <div class="profile__content__image">
                    <img :src="user?.avatarUrl || '../assets/default-avatar.png'" alt="Avatar">
                </div>
                <div class="profile__content__name">
                    <span>Имя</span>
                    <span>{{ user?.username || 'Неизвестный пользователь' }}</span>
                </div>
                <div class="profile__content__desc">
                    <span>Описание</span>
                    <span v-if="!user?.description || user.description.trim() === ''">Пользователь не указал описание</span>
                    <span v-else>{{ userInfo.description }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';

const userId = localStorage.getItem('userId')
const isNameModalVisible = ref(false)
const isDescModalVisible = ref(false)

const props = defineProps<{
    user: {
        username: string;
        description?: string;
        avatarUrl?: string;
    } | null;
}>();

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
}
</style>