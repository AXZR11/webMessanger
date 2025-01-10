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

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const hiddenNavbarRoutes = ['/login', '/register']
const showNavbar = computed(() => !hiddenNavbarRoutes.includes(route.path))

const isProcessingToken = ref(false)

const handleAccessToken = async () => {
  const accessToken = route.query.accessToken

  if (accessToken) {
    console.log('Access token found in query:', accessToken)

    if (typeof accessToken === 'string') {
      authStore.login(accessToken)
      console.log('Access token saved to store.')
    }

    await router.replace({ path: route.path, query: {} })
    console.log('Token removed from query.')
  }
}
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
