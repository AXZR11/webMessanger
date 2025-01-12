<template>
    <div class="register__container">
        <div class="register__content">
            <div class="register__content__text">
                <span>Регистрация</span>
                <span class="register__context__title">Никнейм или почта</span>
                <input v-model="username" type="text">
                <span class="register__context__title">Пароль</span>
                <input v-model="password" type="password">

                <div v-if="error" class="error-message">{{ error }}</div>

                <button @click="handleRegister">Зарегистрироваться</button>

                <span>Уже есть аккаунт? <a @click="$router.push('/login')">Войдите</a></span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref(''); 

const handleRegister = async() => {
    error.value = ''
    if (!username.value || !password.value) {
        error.value = 'Пожалуйста, заполните все поля';
        return;
    }
    try {
        const response = await axios.post('https://backzhirnow.ru.tuna.am/api/auth/register', {
            username: username.value,
            password: password.value
        })

        router.push('/login')
    } catch (error) {
        console.error('Registration error:', err);
        error.value = 'Ошибка при регистрации. Попробуйте снова!';
    }
}
</script>
<style scoped>
.register__container{
    width: 100%;
    height: 100%;
    display: flex;
}
.register__content{
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #74B5FF;
    border-radius: 20px;
    height: 35%;
    width: 30%;
    margin: auto;
    .register__content__text{
        display: flex;
        flex-direction: column;
        width: 90%;
        text-align: center;
        span:first-child{
            font-size: 26px;
            padding: 0 0 20px 0;
        }
        input {
            margin-bottom: 15px;
            height: 30px;
            border: 1px solid #74B5FF;
            border-radius: 10px;
            padding-left: 10px;
            font-size: 16px;
        }
        .register__context__title{
            text-align: left;
            padding: 5px 5px 5px 10px ;
        }
        button{
            height: 35px;
            border: 1px solid #74B5FF;
            border-radius: 10px;
            background: none;
            margin-top: 15px;
        }
        button:hover{
            background: #74B5FF;
        }
    }
}
</style>