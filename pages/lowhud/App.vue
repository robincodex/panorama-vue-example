<script lang="ts">
export default {
    data() {
        return {
            count: 0
        };
    }
};
</script>

<template>
    <button @click="count++">Count is: {{ count }}</button>
</template>

<style lang="scss" scoped>
Button {
    font-weight: bold;
}
</style>
