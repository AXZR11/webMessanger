<template>
    <div class="messages">
            <MessagesList/>
            <MessagesChat/>
    </div>
</template>
<script setup lang="ts">
import MessagesChat from '@/components/MessagesChat.vue';
import MessagesList from '@/components/MessagesList.vue';


</script>
<style scoped>
.messages{
    display: flex;
    height: 100%;
    width: 100%;
}
</style>