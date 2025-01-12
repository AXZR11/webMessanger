<template>
    <div class="messages">
            <MessagesList @chatSelected="selectedChat = $event"/>
            <MessagesChat :chat="selectedChat"/>
    </div>
</template>
<script setup lang="ts">
import MessagesChat from '@/components/MessagesChat.vue';
import MessagesList from '@/components/MessagesList.vue';
import { ref } from 'vue';

interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants: { id: string; username: string; avatarUrl: string }[];
  messages: { id: string; senderId: string; content: string; createdAt: string }[];
}

const selectedChat = ref<Chat | null>(null);
</script>
<style scoped>
.messages{
    display: flex;
    height: 100%;
    width: 100%;
}
</style>