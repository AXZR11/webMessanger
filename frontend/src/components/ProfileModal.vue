<template>
    <div class="profile__overlay" @click="$emit('close')">
        <div class="profile" @click.stop>
            <button class="profile__close" @click="$emit('close')">
                <img src="../assets/user-cancel.svg" alt="">
            </button>
            <div class="profile__content">
                <span class="profile__content__title">Информация о вас</span>
                <div class="profile__content__image">
                    
                </div>
                <div class="profile__content__name">
                    <span>Имя</span>
                    <span @click="openNameModal">Александр</span>
                </div>
                <div class="profile__content__desc">
                    <span>Описание</span>
                    <span @click="openDescModal">23 y.o. работаю в IT, web-designer,<br>играю в футбол</span>
                </div>
            </div>
        </div>
    </div>
    <NameModal
        v-if="isNameModalVisible"
        @close-name-modal="closeNameModal"
    />
    <DescModal
        v-if="isDescModalVisible"
        @close-desc-modal="closeDescModal"
    />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import NameModal from './NameModal.vue';
import DescModal from './DescModal.vue';


const isNameModalVisible = ref(false)
const isDescModalVisible = ref(false)

const openNameModal = () => {
    isNameModalVisible.value = true
}

const closeNameModal = () => {
    isNameModalVisible.value = false
}

const openDescModal = () => {
    isDescModalVisible.value = true
}
const closeDescModal = () => {
    isDescModalVisible.value = false
}
</script>
<style scoped>
.profile__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.profile{
    width: 400px;
    height: 45%;
    position: absolute;
    top: 27vh;
    left: 57vh;
    background: #fff;
    border-radius: 20px;
    z-index: 2;
    .profile__close{
        background: none;
        border: none;
        margin-left: 20px auto;
        position: relative;
        top: 1.5vh;
        left: 40vh;
        cursor: pointer;
    }
}
.profile__content{
    width: 90%;
    margin: auto;
    text-align: center;
    .profile__content__title{
        font-size: 28px;
    }
    .profile__content__image{
        width: 120px;
        height: 120px;
        border: 1px solid #E1E1E1;
        border-radius: 50%;
        margin: 20px auto;
    }
    .profile__content__name,
    .profile__content__desc{
        margin: 20px auto;
        color: #909090;
    }

    .profile__content__name span:first-child,
    .profile__content__desc span:first-child{
        display: block;
        font-size: 20px;
        margin-bottom: 5px;
        color: #000;
    }
    .profile__content__name span:last-child,
    .profile__content__desc span:last-child{
        cursor: pointer;
    }
}
</style>