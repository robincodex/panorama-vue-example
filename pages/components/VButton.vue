<script setup lang="ts">
import { ToBool } from '@common/utils';

const { text, small, large } = defineProps<{ text?: string, small?: Booleanish, large?: Booleanish }>()
</script>

<template>
    <Button :class="{small: ToBool(small)===true, large: ToBool(large)===true}">
        <Label v-if="text" :text="text" ></Label>
    </Button>
</template>

<style lang="scss" scoped>
Button {
    background-color: #333333;
    box-shadow: #000000 0px 0px 4px;
    padding: 10px 30px;

    Label {
        color: #ffffff;
        font-size: 16px;
    }

    &.small {
        padding: 5px 15px;
        font-size: 12px;
    }

    &.large {
        padding: 20px 60px;
        font-size: 24px;
    }
}
</style>
