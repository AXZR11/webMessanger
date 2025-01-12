import { createRouter, createWebHistory } from 'vue-router'
import Messages from '@/views/Messages.vue'
import Friends from '@/views/Friends.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import { useAuthStore } from '@/stores/authStore'
import MessagesList from '@/components/MessagesList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'messages',
      component: Messages,
    },
    {
      path: '/friends',
      name: 'friends',
      component: Friends,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/:friendId',
      name: 'chat',
      component: MessagesList,
      props: true,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const accessToken = to.query.accessToken;
  const userId = to.query.userId; 

  if (accessToken) {
    console.log('Access token detected:', accessToken);

    if (typeof accessToken === 'string') {
      authStore.login(accessToken); // Сохраняем токен
      console.log('Token saved.');
    }

    if (userId && typeof userId === 'string') {
      authStore.setUserId(userId);  // Устанавливаем userId в хранилище
      console.log('User ID saved:', userId);
    }

    // Убираем токен из URL
    next({ path: '/', query: {} });
    return;
  }

  // Проверяем авторизацию
  await authStore.checkAuth();

  if (!authStore.isAuthenticated && !['/login', '/register'].includes(to.path)) {
    console.log('User not authenticated. Redirecting to login...');
    next('/login');
  } else {
    next();
  }
});

export default router
