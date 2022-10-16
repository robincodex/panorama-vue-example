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
    <Button @click="count++">Count is: {{ count }}</Button>
</template>

<style lang="scss" scoped>
Button {
    font-weight: bold;
}
</style>
