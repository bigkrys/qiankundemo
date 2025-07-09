// 新建订阅发布类
interface EventHandler {
    (eventName: string, ...args: unknown[]): void;
}

export const EVENT_MESSAGE_NAME = {
    MAIN_SEND_MESSAGE: 'main-send-message',
    SUB1_SEND_MESSAGE: 'sub-send-message',
    SUB2_SEND_MESSAGE: 'sub2-send-message',
}

export class MainEventBus {
    private events: Record<string, { callback: EventHandler; count: number }[]> = {};

    $on(eventName: string, callback: EventHandler) {
        // 订阅事件
        if (!eventName || typeof callback !== "function") {
            return;
        }
        if (!this.events[eventName]) {
            // 尚未发布事件，压入事件队列
            this.events[eventName] = [];
            this.events[eventName].push({ callback, count: 0 });
        } else {
            const hasExist = this.events[eventName].some(
                (item) => item.callback === callback
            );
            if (hasExist) {
                return;
            }
            this.events[eventName].push({ callback, count: 0 });
        }
    }

    $emit(eventName: string, ...args: unknown[]) {
        // 发布事件
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName].forEach((item) => {
            item.callback(eventName, ...args);
            item.count++;
        });
    }

    $off(eventName: string, callback: EventHandler) {
        // 取消订阅事件
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName] = this.events[eventName].filter(
            (item) => item.callback !== callback
        );
    }

    $offAll() {
        // 取消所有订阅事件
        this.events = {};
    }
}

export class SecureEventBus extends MainEventBus {
    private ALLOWED_EVENTS: {[key: string]: Array<string>} = {}; // 每个app允许的事件
    constructor(allowedEvents: {[key: string]: Array<string>}) {
        super();
        this.ALLOWED_EVENTS = allowedEvents;
    }
    $seOn(appName: string,eventName: string, callback: EventHandler): void {
        if (!this.ALLOWED_EVENTS[appName].includes(eventName)) {
            console.warn(`[Security] 应用 ${appName} 尝试发送未授权事件: ${eventName}`);
            return;
        }
        super.$on(eventName, callback);
    }
    $seEmit(appName: string, eventName: string, ...args: unknown[]): void {
        if (!this.ALLOWED_EVENTS[appName].includes(eventName)) {
            console.warn(`[Security] 应用 ${appName} 尝试发送未授权事件: ${eventName}`);
            return;
        }
        super.$emit(eventName, ...args);
    }

}
// 导出单例实例
export const emitter = new MainEventBus();
