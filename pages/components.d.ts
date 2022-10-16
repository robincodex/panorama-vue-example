declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        Panel: DefineComponent<{}>;
        Button: DefineComponent<{}>;
        Label: DefineComponent<{ text: string }>;
    }
}

export {};
