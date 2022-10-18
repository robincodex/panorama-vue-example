# PUI 范例

此范例仅作为参考，可以根据实际情况修改。

-   安装

```
yarn install
```

-   启动

```
yarn start
```

## 目录结构

-   `pages`文件夹下是每个页面的根文件夹，一个页面一个文件夹。
-   每个页面下都有与页面同名的` .xml` `.ts` `.scss `文件，其中`<页面名称>.ts`是入口

> 添加新文件最好重启监听

## 样式

此范例仅支持 scss，每个页面下的 vue 内的样式和 scss 文件会合并编译成一个文件。

## 关于编译

打包工具采用[Rollup](https://rollupjs.org/guide/en/)，vue 的编译插件使用的是[@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

适配的过程中发现还是挺多兼容性问题，所以改造的东西比较多，如果要用其它工具如 webpack 也是可行的，可参考[compatible-panorama.ts](./plugins/compatible-panorama.ts)这个插件中的`resolveId`，主要是把 vue 的一些文件指向改造后的文件基本就可行了。

## 关于 Ref

`ref`是比较常用的功能，不过目前有个 BUG，比如`$.Msg(el.value)`会抛出错误，目前不知道怎么解决这个 BUG，这个 BUG 是 vue 的机制导致的，尚未找到出现问题的地方。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
const root = ref<Panel | null>();
onMounted(() => {
    try {
        // 这里会抛出错误，但是root.value的确是Panel的实例，
        // 只要不去打印这个root或者root.value就行，
        // 对象内的方法可正常访问，如 root.value?.BHasClass('ABC')。
        $.Msg('onMounted: ', root.value);
    } catch (err) {
        $.Msg('onMounted Err: ', err);
    }
});
</script>

<template>
    <Panel ref="root"> </Panel>
</template>
```
