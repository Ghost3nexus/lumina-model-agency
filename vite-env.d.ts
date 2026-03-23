/// <reference types="vite/client" />

interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
    getApiKey?(): Promise<string>;
}

declare global {
    interface Window {
        aistudio?: AIStudio;
    }
}

export { };
