<template>
    <div class="chat" v-if="chat">
        <div class="chat__header">
            <div class="chat__header__user">
                <div class="chat__header__user__image">
                    <img :src="getChatImage(chat)" alt="">
                </div>
                <div class="chat__header__user__content">
                    <span class="chat__header__user__title">{{ getChatName(chat) }}</span>
                    <span class="chat__header__user__online">Был в сети недавно</span>
                </div>
                <div class="chat__header__user__options" @click="toggleMenu">
                    <img src="../assets/options.svg" alt="">
                    <div v-show="isMenuOpen" class="chat__header__menu">
                        <button class="menu__item delete" @click="deleteChat(chat.id)">Удалить чат</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat__container">
            <div class="chat__messages" ref="messagesContainer">
                <div v-for="message in messages" :key="message.id" class="chat__messages__container">
                    <div class="chat__messages__content">
                            <div class="chat__message" :class="getMessageClass(message)">
                                <img :src="getMessageAvatar(message.senderId)" alt="">
                                <div class="chat__message__text">{{ message.content }}</div>
                                <div class="chat__message__time">{{ formatTime(message.createdAt) }}</div>
                            </div>
                    </div>
                </div>
            </div>

            <div class="chat__input__container">
                <input
                type="text"
                class="chat__message__input"
                placeholder="Напишите сообщение..."
                v-model="newMessage"
                @keydown.enter="sendMessage"
                />
                <button class="chat__send__button" @click="sendMessage">📩</button>
            </div>
        </div>
    </div>
    <div v-else class="chat__empty">
        <p>Выберите чат, чтобы начать общение</p>
    </div>    
</template>
<script setup lang="ts">
import { ref, watch, onMounted, type PropType, onBeforeMount, onBeforeUnmount, nextTick } from 'vue';
import axios from 'axios';
import { defineProps } from 'vue';
import { io } from 'socket.io-client';

interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants: { id: string; username: string; avatarUrl: string }[];
  messages: { id: string; senderId: string; content: string; createdAt: string }[];
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  chatId: string;
}

const props = defineProps<{ chat: Chat | null }>();

const messages = ref<Message[]>([])
const newMessage = ref('');
const isMenuOpen = ref(false)
const userId = localStorage.getItem('userId')
const socket = ref<any>(null)
const selectedChat = ref<Chat | null>(null);
const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const fetchMessages = async () => {
  if (props.chat) {
    try {
      const response = await axios.get(`https://backzhirnow.ru.tuna.am/api/chats/${props.chat.id}/messages`);
      messages.value = response.data;

      nextTick(() => {
        scrollToBottom()
      })
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }
};

const deleteChat = async (chatId: string) => {
    try {
        await axios.delete(`https://backzhirnow.ru.tuna.am/api/chats/${chatId}`)
        alert('Чат успешно удален')
    } catch (error) {
        console.error('Ошибка при удалении чата')
        alert('Не удалось удалить чат')
    }
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !props.chat || !userId) return;

  const message = {
    chatId: props.chat.id,
    senderId: userId,
    content: newMessage.value.trim(),
    createdAt: new Date().toISOString(),
    id: Math.random().toString(36).substring(7),
  };

  socket.value.emit('sendMessage', message);

  socket.value.once('sendMessageResponse', (response: any) => {
    if (response.status === 'success') {
      newMessage.value = ''
      scrollToBottom()
    } else {
      console.error('Failed to send message');
    }
  });
};

const connectToSocket = (chatId: string) => {
  if (socket.value) {
    socket.value.disconnect();
  }

  socket.value = io('https://wszhirnow.ru.tuna.am');
  socket.value.on('connect', () => {
    console.log('Socket connected:', socket.value.id);

    socket.value.emit('join', chatId, (response: any) => {
      if (response?.status === 'success') {
        console.log(`Joined chat room: ${chatId}`);
      } else {
        console.error('Failed to join chat room');
      }
    });
  });

  socket.value.on('receiveMessage', (message: Message) => {
    if (message && message.id && message.createdAt) {
        messages.value = [...messages.value, message]
    } else {
        console.error('Received message is missing required fields:', message);
    }
    });
};

const getChatImage = (chat: Chat) => {
  if (chat.isGroup) {
    return '/path/to/group-avatar.png'
  } else {
    return chat.participants[0]?.avatarUrl || '/path/to/default-avatar.png'
  }
}

const getChatName = (chat: Chat) => {
  if (chat.isGroup) {
    return chat.name;
  } else {
    const otherParticipant = chat.participants.find(p => p.id !== userId);
    return otherParticipant?.username || 'Без имени';
  }
};


const getMessageAvatar = (senderId: string) => {
  const sender = props.chat?.participants.find(p => p.id === senderId)
  return sender?.avatarUrl || '/path/to/default-avatar.png'
}


const getMessageClass = (message: { senderId: string }) => {
  const className = message.senderId === userId ? 'from__user__1' : 'from__user__2';
  console.log(`Message from user ${message.senderId}: ${className}`);
  return className;
};

const formatTime = (time: string) => {
  const date = new Date(time)
  return `${date.getHours()}:${date.getMinutes()}`
}

onMounted(() => {
    if (userId) {
        console.log('Connecting to socket...')
        socket.value = io('https://wszhirnow.ru.tuna.am')
        socket.value.on('connect', () => {
            console.log('Socket connected:', socket.value.id)
        })
        socket.value.on('connect_error', (error: any) => {
            console.error('Socket connection error:', error)
        })

        socket.value.emit('join', userId, (response: any) => {
            if (response.status === 'success') {
                console.log('Successfully joined the socket room')
            } else {
                console.error('Failed to join the socket room')
            }
        })

        socket.value.on('receiveMessage', (message: any) => {
            if (selectedChat.value?.id === message.chatId) {
                messages.value.push(message)
            }
        })
    }
})

watch(() => props.chat, async (newChat, oldChat) => {
  if (newChat?.id !== oldChat?.id) {
    if (newChat) {
      connectToSocket(newChat.id)
      await fetchMessages()
    } else {
      messages.value = []
    }
  }
})

onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>
<style scoped>
.chat{
    width: 100%;
}
.chat__empty{
    width: 100%;
    display: flex;
    p{
        margin: auto;
        background: #F3F9FF;
        padding: 20px;
        border-radius: 15px;
    }
}
.chat__header{
    border-bottom: 1px solid #E1E1E1;
}
.chat__messages__content{
    display: flex;
}
.chat__header__user{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .chat__header__user__image{
        width: 52px;
        height: 52px;
        border: 1px solid #E1E1E1;
        border-radius: 100px;
        margin: 20px 15px 20px 20px;
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .chat__header__user__content{
        display: flex;
        flex-direction: column;
        padding: 13px 30px 10px 0px;
        .chat__header__user__online{
            font-size: 12px;
            color: #909090;
            padding-top: 3px;
        }
    }
    .chat__header__user__options{
        position: relative;
        margin-left: auto;
        padding: 13px 25px 10px 0px;
        cursor: pointer;
        img{
            width: 25px;
        }
        .chat__header__menu{
            position: absolute;
            top: 68px;
            right: 16px;
            background-color: #fff;
            border: 1px solid #E1E1E1;
            border-bottom-right-radius: 15px;
            border-bottom-left-radius: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 100;
            padding: 10px;
            .menu__item{
                display: block;
                width: 100%;
                padding: 10px 20px;
                text-align: left;
                background: none;
                border: none;
                font-size: 14px;
                cursor: pointer;
                border-radius: 10px;
                transition: background-color 0.1s, color 0.1s;
                text-align: center;
            }
            .menu__item.delete{
                color: #000;
                background-color: #e4f1fe;
            }
            .menu__item.delete:hover{
                color: white;
                background-color: #74B5FF;
            }
            .menu__item:hover{
                background-color: #f5f5f5;
            }
        }
    }
}

.chat__container {
  display: flex;
  flex-direction: column;
  height: 89%;
  width: 100%;
  margin: auto;
  border-radius: 8px;
  overflow: hidden;
    .chat__messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scroll-behavior: smooth;
    }
    .chat__date {
        text-align: center;
        color: #888;
        font-size: 14px;
        margin: 10px 0;
        position: relative;
    }
    .chat__date::before,
    .chat__date::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 40%;
        height: 1px;
        background-color: #ccc;
    }
    .chat__date::before {
        left: 0;
    }
    .chat__date::after {
        right: 0;
    }
}

.chat__messages__content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.chat__message {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: flex-end;
    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #007bff;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        overflow: hidden;
    }
    .chat__message__text {
        background-color: #e6f7ff;
        padding: 10px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.4;
        max-width: 70%;
    }
    .chat__message__time {
        font-size: 12px;
        color: #888;
        align-self: flex-end;
    }
}

.chat__content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.chat__message.from__user__1 {
  flex-direction: row;
  justify-content: flex-end;
}

.chat__message.from__user__2 {
  flex-direction: row;
  justify-content: flex-start;
}

.chat__message.from__user__1 .chat__message__text {
  background-color: #d4f8d4;
}

.chat__input__container {
  display: flex;
  padding: 10px;
  background-color: #EDEDED;
    .chat__message__input {
        flex: 1;
        border: none;
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 14px;
        outline: none;
    }
    .chat__message__input:focus {
        border-color: #007bff;
    }
    .chat__send__button {
        background-color: #007bff;
        border: none;
        color: white;
        padding: 10px 16px;
        margin-left: 8px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 16px;
    }
    .chat__send__button:hover {
        background-color: #0056b3;
    }
}
</style>