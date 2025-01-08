<template>
    <div class="friends">
        <FriendsList/>
        <FriendsRequests/>
    </div>
</template>
<script setup lang="ts">
import FriendsList from '@/components/FriendsList.vue';
import FriendsRequests from '@/components/FriendsRequests.vue';


</script>
<style scoped>
.friends{
    display: flex;
    height: 100%;
    width: 100%;
}
</style>