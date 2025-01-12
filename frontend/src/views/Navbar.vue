<template>
    <div class="navbar">
        <div class="navbar__header">
            <button class="navbar__image" @click="openProfileModal">
                <img :src="avatarUrl" alt="">
            </button>
            <button 
                class="navbar__friends"
                @click="$router.push('/friends')"
                :class="{ active: isActive('/friends') }"
            >
                <img src="../assets/friends.svg" alt="">
            </button>
            <button 
                class="navbar__messages" 
                @click="$router.push('/')"
                :class="{ active: isActive('/') }"
            >
                <img src="../assets/messages.svg" alt="">
            </button>
        </div>
        <div class="navbar__bottom">
            <button class="navbar__exit" @click="logout">
                <img src="../assets/exit.svg" alt="">
            </button>
        </div>
    </div>
    <ProfileModal v-if="isProfileModalVisible" @close="closeProfileModal"/>
</template>
<script setup lang="ts">
import ProfileModal from '@/components/ProfileModal.vue';
import axios from 'axios';
import defaultAvatar from '@/assets/default-avatar.png';
import { onMounted, ref } from 'vue';
import { defineProps } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute();
const avatarUrl = ref<string>(defaultAvatar)

const isActive = (path: string) => {
  return route.path === path;
}

const props = defineProps({
  logout: { type: Function, required: true },
});

const logout = () => {
    props.logout()
    router.push('/login')
}

const isProfileModalVisible = ref(false)

const openProfileModal = () => {
    isProfileModalVisible.value = true
}

const closeProfileModal = () => {
    isProfileModalVisible.value = false
}

onMounted(async () => {
    try {
        const response = await axios.get('https://backzhirnow.ru.tuna.am/api/users/me', {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
        avatarUrl.value = response.data.avatarUrl || defaultAvatar
    } catch (error) {
        console.error('Ошибка загрузки аватара:', error);
        avatarUrl.value = defaultAvatar;
    }
})
</script>
<style scoped>
.navbar{
    width: 8%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #E1E1E1;
}

button {
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    margin: 0px 0px 10px 0px;
}

.navbar__header{
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
        padding: 10px;
        margin-bottom: 0px;
    }
    button:first-child:hover {
        padding: 0px;
        max-height: none;
    }
    button:hover{
        background: #f7faff;
        max-height: 56px
    }
    button:first-child {
        padding: 0;
        margin-bottom: 15px;
    }
    button.active {
        background: #e4f1fe;
        max-height: 56px;
    }
}

.navbar__image{
    width: 55px;
    height: 55px;
    border: 2px solid #74B5FF;
    border-radius: 100px;
    margin: 30px 0px 0px 0px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.navbar__bottom{
    display: flex;
    flex-direction: column;
    margin-top: auto;
    img {
        width: 35px;
    }
    button {
        padding: 10px;
        margin-bottom: 15px;
        max-height: 56px
    }
    button:hover{
        background: #f7faff;
        max-height: 56px
    }
}
</style>