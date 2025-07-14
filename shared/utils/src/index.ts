// 新建订阅发布类
interface EventHandler {
    (eventName: string, ...args: unknown[]): void;
}

export const EVENT_MESSAGE_NAME = {
    MAIN_SEND_MESSAGE: 'main-send-message',
    SUB1_SEND_MESSAGE: 'sub1-send-message',
    SUB2_SEND_MESSAGE: 'sub2-send-message',
} as const;

export type EventMessageName = typeof EVENT_MESSAGE_NAME[keyof typeof EVENT_MESSAGE_NAME];

export interface MessageData {
    from: string;
    to?: string;
    content: string;
    timestamp: number;
    type: EventMessageName;
}

export class MainEventBus {
    private events: Record<string, { callback: EventHandler; count: number }[]> = {};
    private messageHistory: MessageData[] = [];

    $on(eventName: string, callback: EventHandler) {
        // 订阅事件
        if (!eventName || typeof callback !== "function") {
            console.warn('Invalid event name or callback function');
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
                console.warn(`Callback already registered for event: ${eventName}`);
                return;
            }
            this.events[eventName].push({ callback, count: 0 });
        }
    }

    $emit(eventName: string, ...args: unknown[]) {
        // 发布事件
        if (!this.events[eventName]) {
            console.warn(`No listeners for event: ${eventName}`);
            return;
        }
        
        // 记录消息历史
        const messageData: MessageData = {
            from: 'unknown',
            content: args[0] as string || '',
            timestamp: Date.now(),
            type: eventName as EventMessageName
        };
        this.messageHistory.push(messageData);

        this.events[eventName].forEach((item) => {
            try {
                item.callback(eventName, ...args);
                item.count++;
            } catch (error) {
                console.error(`Error in event handler for ${eventName}:`, error);
            }
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

    // 获取消息历史
    getMessageHistory(): MessageData[] {
        return [...this.messageHistory];
    }

    // 清空消息历史
    clearMessageHistory(): void {
        this.messageHistory = [];
    }

    // 获取事件统计信息
    getEventStats(): Record<string, number> {
        const stats: Record<string, number> = {};
        Object.keys(this.events).forEach(eventName => {
            stats[eventName] = this.events[eventName].length;
        });
        return stats;
    }
}

export class SecureEventBus extends MainEventBus {
    private ALLOWED_EVENTS: {[key: string]: Array<string>} = {}; // 每个app允许的事件
    private appName: string = 'unknown';

    constructor(allowedEvents: {[key: string]: Array<string>}, appName?: string) {
        super();
        this.ALLOWED_EVENTS = allowedEvents;
        this.appName = appName || 'unknown';
    }

    setAppName(appName: string): void {
        this.appName = appName;
    }

    $seOn(appName: string, eventName: string, callback: EventHandler): void {
        if (!this.ALLOWED_EVENTS[appName]?.includes(eventName)) {
            console.warn(`[Security] 应用 ${appName} 尝试订阅未授权事件: ${eventName}`);
            return;
        }
        super.$on(eventName, callback);
    }

    $seEmit(appName: string, eventName: string, ...args: unknown[]): void {
        if (!this.ALLOWED_EVENTS[appName]?.includes(eventName)) {
            console.warn(`[Security] 应用 ${appName} 尝试发送未授权事件: ${eventName}`);
            return;
        }
        super.$emit(eventName, ...args);
    }

    // 安全的消息发送方法
    sendSecureMessage(to: string, content: string, type: EventMessageName): void {
        const messageData: MessageData = {
            from: this.appName,
            to,
            content,
            timestamp: Date.now(),
            type
        };
        super.$emit(type, content, messageData);
    }
}

// 导出单例实例
export const emitter = new MainEventBus();

// 导出工具函数
export const createMessage = (from: string, content: string, type: EventMessageName, to?: string): MessageData => ({
    from,
    to,
    content,
    timestamp: Date.now(),
    type
});

export const validateMessage = (message: MessageData): boolean => {
    return !!(message.from && message.content && message.type && message.timestamp);
};
