declare module '@myqiankun/utils' {
  export const EVENT_MESSAGE_NAME: {
    MAIN_SEND_MESSAGE: string;
    SUB1_SEND_MESSAGE: string;
    SUB2_SEND_MESSAGE: string;
  };

  export interface MessageData {
    from: string;
    to?: string;
    content: string;
    timestamp: number;
    type: string;
  }

  export class MainEventBus {
    $on(eventName: string, callback: (eventName: string, ...args: unknown[]) => void): void;
    $emit(eventName: string, ...args: unknown[]): void;
    $off(eventName: string, callback: (eventName: string, ...args: unknown[]) => void): void;
    $offAll(): void;
    getMessageHistory(): MessageData[];
    clearMessageHistory(): void;
    getEventStats(): Record<string, number>;
  }

  export class SecureEventBus extends MainEventBus {
    constructor(allowedEvents: {[key: string]: Array<string>}, appName?: string);
    setAppName(appName: string): void;
    $seOn(appName: string, eventName: string, callback: (eventName: string, ...args: unknown[]) => void): void;
    $seEmit(appName: string, eventName: string, ...args: unknown[]): void;
    sendSecureMessage(to: string, content: string, type: string): void;
  }

  export const emitter: MainEventBus;
  export const createMessage: (from: string, content: string, type: string, to?: string) => MessageData;
  export const validateMessage: (message: MessageData) => boolean;
}

declare global {
  interface Window {
    mainEventBus: any;
    sharedLib: any;
    globalStore: any;
  }
} 