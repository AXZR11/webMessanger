import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false);

    const checkAuth = () => {
        const token = localStorage.getItem('accessToken');
        isAuthenticated.value = !!token; // Проверка наличия токена
    };

    const login = (token: string) => {
        console.log('Login function called with token:', token);
        localStorage.setItem('accessToken', token);
        isAuthenticated.value = true;
    };

    const checkUserId = () => {
        const userId = localStorage.getItem('userId')
    }

    const setUserId = (userId: string) => {
        console.log('Login function called with token:', userId);
        localStorage.setItem('userId', userId);
        isAuthenticated.value = true;
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        isAuthenticated.value = false; // Сбрасываем состояние
    };

    return {
        isAuthenticated,
        checkAuth,
        login,
        logout,
        setUserId
    };
});
