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

const selectedChat = ref(null)
</script>
<style scoped>
.messages{
    display: flex;
    height: 100%;
    width: 100%;
}
</style>