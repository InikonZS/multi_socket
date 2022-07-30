export interface IConnection {
    sendMessage: (data: string) => void;
    onMessage: (message: string) => void;
}