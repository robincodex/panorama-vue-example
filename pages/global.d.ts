declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '*.scss';

declare const console: {
    log(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
};
