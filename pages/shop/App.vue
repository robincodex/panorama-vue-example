<script setup lang="ts">
const {count} = defineProps<{count: number}>()
</script>

<template>
    <Button @click="count++">Count is: {{ count }}</Button>
    <Button @activate="count++" class="Red" >{{ count }}</Button>
    <Label text="xxxx" />
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
