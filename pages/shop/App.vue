<script setup lang="ts">
import { onMounted } from 'vue';
import IHButton from '../components/IHButton.vue';
import Item from './components/Item.vue';
onMounted(() => {
    try {
        // $.Msg($("#TestLabel"))
    } catch (err) {
        $.Msg(err)
    }
})
</script>

<template>
    <IHButton text="按钮 小" small ></IHButton>
    <IHButton text="按钮 正常" ></IHButton>
    <IHButton text="按钮 大" large ></IHButton>
    <Label id="TestLabel" text="xxx"></Label>
    <Item name="ShopItem" />
</template>

<style lang="scss" scoped>
Button {
    font-weight: bold;

    &.Red {
        Label {
            color: red;
        }
    }
}

Label {
    color: #ffffff;
}
</style>
