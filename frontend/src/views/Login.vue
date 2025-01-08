<template>
    <div class="login__container">
        <div class="login__content">
            <div class="login__content__text">
                <span>Авторизация</span>
                <span class="login__context__title">Никнейм или почта</span>
                <input v-model="username" type="text">
                <span class="login__context__title">Пароль</span>
                <input v-model="password" type="password">
                <button @click="handleLogin">Войти</button>
                <div v-if="loginError" class="error-message">{{ loginError }}</div> 
                <div class="login__social">
                    <div class="login__social__image" @click="redirectToVk">
                        <img src="../assets/vk-auth.svg" alt="">
                    </div>
                    <div class="login__social__image" @click="redirectToYandex">
                        <img src="../assets/ya-auth.svg" alt="">
                    </div>
                </div>
                <span>Нет аккаунта? <a @click="$router.push('/register')">Зарегистрируйся</a></span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const username = ref('')
const password = ref('')
const loginError = ref('')

const handleLogin = async () => {
    loginError.value = ''
    try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            username: username.value,
            password: password.value
        })

        const { accessToken } = response.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('userId', response.data.userId)
        router.push('/')
    } catch (error) {
        console.error('Login error:', error)
        loginError.value = 'Неверный логин или пароль'
    }
}

const redirectToVk = () => {
    window.location.href = 'http://localhost:3000/api/auth/vk'
}

const redirectToYandex = () => {
    window.location.href = 'http://localhost:3000/api/auth/yandex'
}

const handleYandexRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('accessToken')
    const userId = urlParams.get('userId'); 

    if (accessToken && userId) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('userId', userId);
        router.push('/')
    } else {
        loginError.value = 'Ошибка авторизации через Yandex'
    }
}

onMounted(() => {
    if (window.location.search.includes('accessToken')) {
        handleYandexRedirect()
    }
})
</script>
<style scoped>
.login__container{
    width: 100%;
    height: 100%;
    display: flex;
}
.login__content{
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #74B5FF;
    border-radius: 20px;
    height: 45%;
    width: 30%;
    margin: auto;
    .login__content__text{
        display: flex;
        flex-direction: column;
        width: 90%;
        text-align: center;
        span:first-child{
            font-size: 26px;
            padding: 15px 0 20px 0;
        }
        span:last-child{
            font-size: 14px;
            margin-bottom: 15px;
            a{
                color: #74B5FF;
            }
        }
        input {
            margin-bottom: 15px;
            height: 30px;
            border: 1px solid #74B5FF;
            border-radius: 10px;
            padding-left: 10px;
            font-size: 16px;
        }
        .login__context__title{
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
.login__social{
    display: flex;
    margin: auto;
    .login__social__image{
        margin: auto;
        padding: 15px;
        cursor: pointer;
    }
}
</style>