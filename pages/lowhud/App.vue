<script lang="ts">
import IHButton from '../components/IHButton.vue';

export default {
    data() {
        return {
            count: 0
        };
    },
    components: { IHButton }
};
</script>

<template>
    <IHButton text="按钮 正常" ></IHButton>
</template>

<style lang="scss" scoped>
Button {
    font-weight: bold;
}
</style>
