<template>
    <div class="list">
        <div class="list__search">
            <input 
            type="text" 
            class="list__search__input" 
            placeholder="Поиск"
            v-model="searchQuery"
            >
        </div>
        <h1>Друзья</h1>
        <div  v-if="friends.length === 0" class="list__none__friends">
                Список друзей пуст
        </div>
        <div v-for="friend in filteredFriends" :key="friend.id" class="list__user">
            <div class="list__user__image">
                <img :src="friend.avatarUrl || '../assets/default-avatar.png'" alt="">
            </div>
            <div class="list__user__content">
                <span class="list__user__content__title">{{ friend.username }}</span>
                <span class="list__user__content__message">Был в сети недавно</span>
            </div>
            <div class="list__user__date">
                <!-- <img 
                    src="../assets/user-message.svg"
                    alt=""
                > -->
                <img 
                    src="../assets/user-delete.svg" 
                    alt=""
                    @click="removeFriend(friend.id)"
                >
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const friends = ref<any[]>([])
const searchQuery = ref('')

const fetchFriends = async () => {
    try {
        const userId = localStorage.getItem('userId')

        if (!userId) {
            console.error('User ID not found')
            return
        }

        const response = await axios.get('https://backzhirnow.ru.tuna.am/api/users/list', { 
            params: { userId } 
        })
        friends.value = response.data
    } catch (error) {
        console.error('Ошибка при получении друзей:', error)
    }
}

const removeFriend = async (friendId: string) => {
    try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            console.error('Token not found')
            return
        }

        await axios.delete(`https://backzhirnow.ru.tuna.am/api/users/remove/${friendId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        friends.value = friends.value.filter((friend) => friend.id !== friendId)
    } catch (error) {
        console.error('Ошибка при удалении друга:', error)
    }
}

const filteredFriends = computed(() => {
    return friends.value.filter(friend => 
        friend.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

onMounted(() => {
    fetchFriends()
})
</script>
<style scoped>
.list{
    border-right: 1px solid #E1E1E1;
    height: 100%;
    width: 50%;
    .list__none__friends{
        padding: 0 20px 10px 20px;
    }
}

h1{
    padding: 0 20px 10px 20px;
}

.list__user{
    border-bottom: 1px solid #E1E1E1;
    display: flex;
    .list__user__image{
        width: 42px;
        height: 42px;
        border: 1px solid #E1E1E1;
        border-radius: 100px;
        margin: 10px 15px 10px 20px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .list__user__content{
        display: flex;
        flex-direction: column;
        padding: 13px 30px 10px 0px;
        .list__user__content__message{
            font-size: 12px;
            color: #909090;
            padding-top: 3px;
        }
    }
    .list__user__date{
        display: flex;
        align-items: center;
        margin-left: auto;
        padding: 13px 20px 10px 0px;
        img:first-child{
            margin-right: 15px;
        }
        img{
            cursor: pointer;
        }
    }
}
.list__search{
    margin: 20px;
    input{
        height: 2vh;
        width: 40vh;
        padding: 11px 40px 12px 13px;
        border: 2px solid #E1E1E1;
        border-radius: 15px;
        background: url('../assets/search-icon.svg') no-repeat right 13px center;
        background-size: 16px;
        font-size: 16px;
        color: #555;
    }
}
</style>