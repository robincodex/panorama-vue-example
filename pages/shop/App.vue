<script setup lang="ts">
import { onMounted } from 'vue';
import VButton from '../components/VButton.vue';
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
    <VButton text="按钮 小" small ></VButton>
    <VButton text="按钮 正常" ></VButton>
    <VButton text="按钮 大" large ></VButton>
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
