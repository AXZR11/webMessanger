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
                    <div v-if="isMenuOpen" class="chat__header__menu">
                        <button class="menu__item delete" @click="deleteChat(chat.id)">Удалить чат</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat__container">
            <div class="chat__messages">
                <div class="chat__date">Сегодня</div>

                <div class="chat__message from__user__1">
                <div class="chat__avatar">A</div>
                <div class="chat__content">
                    <div class="chat__message__text">Привет, как дела?</div>
                    <div class="chat__message__time">12:34</div>
                </div>
                </div>

                <div class="chat__message from__user__2">
                <div class="chat__avatar">B</div>
                <div class="chat__content">
                    <div class="chat__message__text">Все отлично! А у тебя?</div>
                    <div class="chat__message__time">12:35</div>
                </div>
                </div>

                <div class="chat__date">Вчера</div>

                <div class="chat__message from__user__1">
                <div class="chat__avatar">A</div>
                <div class="chat__content">
                    <div class="chat__message__text">Работаю над проектом.</div>
                    <div class="chat__message__time">18:20</div>
                </div>
                </div>
            </div>

            <div class="chat__input__container">
                <input
                type="text"
                class="chat__message__input"
                placeholder="Напишите сообщение..."
                />
                <button class="chat__send__button">📩</button>
            </div>
        </div>
    </div>
    <div v-else class="chat__empty">
        <p>Выберите чат, чтобы начать общение</p>
    </div>    
</template>
<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'

defineProps(['chat'])

const userId = localStorage.getItem('userId')
const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const deleteChat = async (chatId: string) => {
    try {
        await axios.delete(`http://localhost:3000/api/chats/${chatId}`)
        alert('Чат успешно удален')
    } catch (error) {
        console.error('Ошибка при удалении чата')
        alert('Не удалось удалить чат')
    }
}

const getChatName = (chat: any) => {
    if (!chat) return ''
    if (chat.isGroup) return chat.name || 'Групповой чат'
    const otherParticipant = chat.participants?.find((p: any) => p.id !== userId)
    return otherParticipant?.username || 'Без имени'
}

const getChatImage = (chat: any) => {
    if (!chat) return '../assets/default-avatar.png'
    const otherParticipant = chat.participants?.find((p: any) => p.id !== userId)
    return otherParticipant?.avatarUrl || '../assets/default-avatar.png'
}
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

.chat__message {
  display: flex;
  align-items: flex-end;
  gap: 10px;
    .chat__avatar {
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
    }
    .chat__content {
        max-width: 70%;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .chat__message__text {
        background-color: #e6f7ff;
        padding: 10px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.4;
    }
    .chat__message__time {
        font-size: 12px;
        color: #888;
        align-self: flex-end;
    }
}

.chat__message.from__user__1 {
  flex-direction: row-reverse;
}

.chat__message.from__user__2 {
  flex-direction: row;
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