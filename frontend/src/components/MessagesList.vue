<template>
    <div class="list">
        <div class="list__search">
            <input type="text" class="list__search__input" placeholder="Поиск">
        </div>
        <h1>Сообщения</h1>
        <div class="list__user">
            <div class="list__user__image">
                
            </div>
            <div class="list__user__content">
                <span class="list__user__content__title">Александр Жирнов</span>
                <span class="list__user__content__message">Буквально 2-3 рабочих дня</span>
            </div>
            <div class="list__user__date">
                <span class="list__user__date__text">02:11</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">

</script>
<style scoped>
.list{
    border-right: 1px solid #E1E1E1;
    height: 100%;
    width: 600px;
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
        margin-left: auto;
        padding: 13px 20px 10px 0px;
        span{
            font-size: 12px;
            color: #909090;
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