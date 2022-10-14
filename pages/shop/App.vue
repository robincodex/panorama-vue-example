<script setup lang="ts">
import Item from './components/Item.vue';
const {count} = defineProps<{count: number}>()
</script>

<template>
    <Button @click="count++">Count is: {{ count }}</Button>
    <Button @activate="count++" class="Red" >{{ count }}</Button>
    <Label text="xxxx" />
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
