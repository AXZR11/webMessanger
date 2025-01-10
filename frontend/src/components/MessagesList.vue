<template>
    <div class="list">
        <div class="list__search">
            <input type="text" class="list__search__input" placeholder="Поиск" v-model="searchQuery">
        </div>
        <h1>Сообщения</h1>
        <div 
            v-for="chat in filteredChats"
            :key="chat.id" 
            @click="selectChat(chat)"
            :class="{ 'list__user--active': selectedChatId === chat.id }" 
            class="list__user">
            <div class="list__user__image">
                <img :src="getChatImage(chat)" alt="">
            </div>
            <div class="list__user__content">
                <span class="list__user__content__title">
                    {{ getChatName(chat) }}
                </span>
                <span class="list__user__content__message">
                    {{ getLastMessage(chat) }}
                </span>
            </div>
            <div class="list__user__date">
                <span class="list__user__date__text">
                    {{ getLastMessageTime(chat) }}
                </span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

interface Participant {
    id: string
    username: string
    avatarUrl: string
}

interface Chat {
    id: string
    name: string | null
    isGroup: boolean
    participants: { id:string; username: string; avatarUrl: string }[]
    messages: { content: string; createdAt: string }[]
    updatedAt: string
}

const userId = localStorage.getItem('userId')
const chats = ref<Chat[]>([])
const searchQuery = ref('')
const emit = defineEmits(['chatSelected'])
const selectedChatId = ref(null)

const fetchChats = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/chats/user/${userId}`)
        chats.value = response.data
    } catch (error) {
        console.error('Ошибка при получении чатов:', error)
    }
}

const getChatName = (chat: Chat) => {
    if (chat.isGroup) return chat.name || 'Групповой чат'
    const otherPaticipant = chat.participants.find((p) => p.id !== userId)
    return otherPaticipant?.username || 'Неизвестный'
}

const getLastMessage = (chat: Chat) => {
    const getLastMessage = chat.messages[chat.messages.length - 1]
    return getLastMessage?.content || 'Теперь твой друг!'
}

const getLastMessageTime = (chat: Chat) => {
    const lastMessage = chat.messages[chat.messages.length - 1]
    if (!lastMessage) return ''
    return new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getChatImage = (chat: Chat) => {
    const otherParticipant = chat.participants.find((p) => p.id !== userId)
    return otherParticipant?.avatarUrl || '../assets/default-avatar.png'
}

const filteredChats = computed(() => {
    return chats.value.filter(chat => {
        const chatName = getChatName(chat).toLowerCase()
        return chatName.includes(searchQuery.value.toLowerCase())
    })
})

const selectChat = (chat: any) => {
    emit('chatSelected', chat)
    selectedChatId.value = chat.id
}

onMounted(() => {
    fetchChats()
})
</script>
<style scoped>
.list{
    border-right: 1px solid #E1E1E1;
    height: 100%;
    width: 78vh;
    overflow-y: auto;
}

.list::-webkit-scrollbar {
    display: none;
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
        margin-left: auto;
        padding: 13px 20px 10px 0px;
        span{
            font-size: 12px;
            color: #909090;
        }
    }
}
.list__user:hover {
    background: #F3F9FF;
    cursor: pointer;
}
.list__user--active {
    background: #F3F9FF;
    cursor: pointer;
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