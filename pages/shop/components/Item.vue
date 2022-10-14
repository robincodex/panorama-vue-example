<script setup lang="ts">
const {name} = defineProps<{name: string}>()
</script>

<template>
    <Button >{{ name }}</Button>
</template>

<style lang="scss" scoped>
Button {
    background-color: #222222;
    Label {
        color: #ffffff;
    }
}
</style>
