<template>
    <div class="list">
        <div class="list__search">
            <input 
                type="text" 
                class="list__search__input" 
                placeholder="Введите имя"
                v-model="nickname"
            >
            <button class="list__search__btn" @click="sendFriendRequest">Отправить</button>
        </div>
        <div class="list__header">
            <h1>Заявки</h1>
            <div class="toggle-buttons">
                <button 
                    @click="toggleRequests('incoming')" 
                    :class="{ active: isIncoming }"
                >Входящие</button>
                <button 
                    @click="toggleRequests('outgoing')" 
                    :class="{ active: !isIncoming }"
                >Исходящие</button>
            </div>
        </div>
        <div v-if="isIncoming && filteredRequests.length === 0" class="list__none__requests">
            У вас нет входящих заявок
        </div>
        <div v-if="!isIncoming && filteredRequests.length === 0" class="list__none__requests">
            У вас нет исходящих заявок
        </div>
        <div v-for="request in filteredRequests" :key="request.id" class="list__user">
            <div class="list__user__image">
                <img :src="request.avatarUrl || '../assets/default-avatar.png'" alt="">
            </div>
            <div class="list__user__content">
                <span class="list__user__content__title">{{ isIncoming ? request.requester.username : request.receiver.username }}</span>
                <span class="list__user__content__message">{{ request.status }}</span>
            </div>
            <div class="list__user__date">
                <img v-if="isIncoming" src="../assets/user-accept.svg" @click="acceptRequest(request.id)" alt="">
                <img src="../assets/user-cancel.svg" @click="rejectRequest(request.id)" alt="">
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

interface Request {
    id: string;
    requesterId: string;
    receiverId: string;
    status: string;
    requester: { username: string };
    receiver: { username: string };
}

const nickname = ref('')
const requests = ref<Request[]>([])
const isIncoming = ref(true);

const toggleRequests = (type: 'incoming' | 'outgoing') => {
  isIncoming.value = type === 'incoming';
  fetchRequests();
};

const userId = localStorage.getItem('userId');

const fetchRequests = async () => {
    try {
        const userId = localStorage.getItem('userId')

        if (!userId) {
            console.error('User ID not found')
            return
        }

        const response = await axios.get('http://localhost:3000/api/users/requests', {
            params: { userId }
        })
        requests.value = response.data
    } catch (error) {
        console.error('Ошибка при получении заявок:', error)
    }
}

const sendFriendRequest = async () => {
    if (nickname.value.trim() === '') {
        return
    }
    try {
        const userResponse = await axios.get(`http://localhost:3000/api/users/username/${nickname.value}`)
        const receiverId = userResponse.data.id

        const requesterId = localStorage.getItem('userId')

        if (!requesterId) {
            console.error('Ошибка: Не удалось получить ID текущего пользователя')
            return;
        }

        await axios.post('http://localhost:3000/api/users/requests', {
            requesterId,
            receiverId,
        })

        console.log('Заявка отправлена успешно')
        fetchRequests()
    } catch (error) {
        console.error('Ошибка при отправке заявки:', error)
    }
}

const acceptRequest = async (requestId: string) => {
    try {
        const token = localStorage.getItem('accessToken')

        await axios.put(`http://localhost:3000/api/users/requests/${requestId}`, 
        { status: 'accepted'},
        { headers: {
            Authorization: `Bearer ${token}`
        }}
    );

        console.log('Заявка принята');
        fetchRequests();
    } catch (error) {
        console.error('Ошибка при принятии заявки:', error);
    }
}

const rejectRequest = async (requestId: string) => {
    try {
        const token = localStorage.getItem('accessToken')

        await axios.put(`http://localhost:3000/api/users/requests/${requestId}`, 
        { status: 'rejected'},
        { headers: {
            Authorization: `Bearer ${token}`
        }}
    );

        console.log('Заявка отклонена');
        fetchRequests();
    } catch (error) {
        console.error('Ошибка при отклонении заявки:', error);
    }
}

const filteredRequests = computed(() => {
  if (!userId) {
    console.error('User ID not found in filteredRequests');
    return [];
  }

  console.log('Requests before filter:', requests.value);
  const filtered = requests.value.filter(request => {
    if (isIncoming.value) {
      return request.receiverId === userId && request.status === 'pending';
    } else {
      return request.requesterId === userId && request.status === 'pending';
    }
  });

  console.log('Filtered requests:', filtered);
  return filtered;
});

onMounted(() => {
    fetchRequests()
})
</script>
<style scoped>
.list{
    border-right: 1px solid #E1E1E1;
    height: 100%;
    width: 50%;
    .list__none__requests{
        padding: 0 20px 10px 20px;
    }
}

.list__header{
    display: flex;
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
    button{
        height: 4.8vh;
        width: 13vh;
        background: #D9ECFF;
        border: 2px solid #D9ECFF;
        border-radius: 10px;
        margin-left: 10px;
    }
    button:hover{
        background: none;
    }
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle-buttons button {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.toggle-buttons button.active {
  background-color: #D9ECFF;
  border-color: #D9ECFF;
}
</style>