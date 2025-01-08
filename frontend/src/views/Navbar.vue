<template>
    <div class="navbar">
        <div class="navbar__header">
            <button class="navbar__image" @click="openProfileModal">
                <img src="" alt="">
            </button>
            <button class="navbar__friends" @click="$router.push('/friends')">
                <img src="../assets/friends.svg" alt="">
            </button>
            <button class="navbar__messages" @click="$router.push('/')">
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
import { ref } from 'vue';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

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
    background: none;
    border: none;
    cursor: pointer;
    margin: 30px 0px 30px 0px;
}

.navbar__header{
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
        margin-bottom: 0px;
    }
}

.navbar__image{
    width: 40px;
    height: 40px;
    border: 1px solid #74B5FF;
    border-radius: 100px;
    margin: 30px 0px 0px 0px;
}

.navbar__bottom{
    display: flex;
    flex-direction: column;
    margin-top: auto;
}
</style>