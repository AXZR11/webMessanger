<template>
  <div class="app">
    <Navbar
      v-if="showNavbar"
      :logout="authStore.logout"
    />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import Navbar from './views/Navbar.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const hiddenNavbarRoutes = ['/login', '/register'];
const showNavbar = computed(() => !hiddenNavbarRoutes.includes(route.path));

// Флаг обработки токена
const isProcessingToken = ref(false);

const handleAccessToken = async () => {
  const accessToken = route.query.accessToken;

  if (accessToken) {
    console.log('Access token found in query:', accessToken);

    if (typeof accessToken === 'string') {
      authStore.login(accessToken); // Сохраняем токен в хранилище
      console.log('Access token saved to store.');
    }

    // Убираем токен из URL
    await router.replace({ path: route.path, query: {} });
    console.log('Token removed from query.');
  }
};

// onMounted(async () => {
//   console.log('onMounted hook started.');

//   // Устанавливаем флаг обработки токена
//   isProcessingToken.value = true;

//   await handleAccessToken();

//   // Проверяем статус авторизации
//   await authStore.checkAuth();

//   console.log('Auth status after checkAuth:', authStore.isAuthenticated);

//   // Сбрасываем флаг обработки токена
//   isProcessingToken.value = false;

//   // Редирект только после завершения всех проверок
//   if (!authStore.isAuthenticated && !hiddenNavbarRoutes.includes(route.path) && !isProcessingToken.value) {
//     console.log('User is not authenticated. Redirecting to login...');
//     router.push('/login');
//   } else {
//     console.log('User is authenticated or in an allowed route.');
//   }
// });
</script>


<style>
*{
  margin: 0;
  padding: 0;
  font-family: Inter;
}

.app {
  display: flex;
  height: 900px;
}
</style>
