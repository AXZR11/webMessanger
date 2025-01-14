<template>
    <div class="profile__overlay" @click="$emit('close-name-modal')">
        <div class="profile" @click.stop>
            <div class="profile__content">
                <span>Введите ваше новое имя</span>
                <input type="text" v-model="username">
                <div class="name__change__btns">
                    <button @click="updateName">Сохранить</button>
                    <button @click="$emit('close-name-modal')">Закрыть</button>
                </div>
                <span v-if="changeError" class="error__message">{{ changeError }}</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const emit = defineEmits(['username-updated', 'close-name-modal']);
const username = ref('')
const userId = localStorage.getItem('userId')
const changeError = ref('')

const updateName = async() => {
    changeError.value = ''
    try {
        if (!username.value.trim()) {
            console.error('Имя не может быть пустым');
            changeError.value = 'Имя не может быть пустым'
            return;
        }

        const response = await axios.patch(`https://backzhirnow.ru.tuna.am/api/users/${userId}/username`,{
            username: username.value
        })
        username.value = ''
        console.log('Имя успешно изменено')

        const updatedName = response.data.username;
        emit('username-updated', updatedName);

        emit('close-name-modal');
    } catch (error) {
        console.error('Ошибка в изменении имени:', error)
        changeError.value = 'Ошибка в процессе изменения имени'
    }
} 
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
    width: 350px;
    height: 15%;
    position: absolute;
    top: 42vh;
    left: 59.8vh;
    background: #fff;
    border-radius: 15px;
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
    display: flex;
    flex-direction: column;
    margin: auto;
    margin-top: 18px;
    text-align: center;
    gap: 10px;
    input {
        padding: 5px;
        border: 1px solid #ADADAD;
        border-radius: 10px;
    }
    .name__change__btns{
        display: flex;
        button{
            width: 47%;
            height: 3vh;
            margin: auto;
            background: #D9ECFF;
            border: none;
            border-radius: 10px;
            cursor: pointer;
        }
    }
    .error__message{
        font-size: 10px;
        height: 10px;
        margin: -5px 0px 0px 0px;
        color: red;
    }
}    
</style>