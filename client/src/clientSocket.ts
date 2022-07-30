import Signal from './common/signal';
import { ITypedMessage } from '../../dto/ITypedMessage';

export class ClientSocket{
  onMessage: Signal<ITypedMessage> = new Signal();
  private _websocket: WebSocket;
  nextId: () => string;

  constructor(url: string) {
    this._websocket = new WebSocket(url);
    //this.nextId = createIdGenerator('socketRequest');
    /*const batchConnection = new BatchConnection(new Connection(this._websocket));
    batchConnection.onMessage = (message) => {
      const msg = JSON.parse(message);
      if (msg.type && msg.type === "ping") {
        this.sendMessage("pong", "");
      }
      this.onMessage.emit(msg);
    }*/
    this._websocket.onmessage = (message) => {
        console.log(message);
      }
    this._websocket.onclose = (_) => {
      console.log("Socket is closed. Reconnect will be attempted in 1 second.");
      console.log('TODO disconnect')
      setTimeout(() => {
        // this.connect();
        console.log('TODO reconnect')
      }, 1000);
    }
    this._websocket.onerror = (err) => {
      console.error("Socket encountered error: ", err, "Closing socket");
    }
  }

  sendMessage(type: string, data: string) {
    const requestMessage:ITypedMessage = {
      sessionID: '0',//session.id,
      type: type, 
      content: data,
      requestID: Math.random().toString()//this.nextId(),
    };
    const result = new Promise<string>((resolve) => {
      const privateMessageHandler = (message: ITypedMessage) => {
        if (
          message.requestID == requestMessage.requestID &&
          "privateResponse" == message.type
        ) {
          this.onMessage.remove(privateMessageHandler);
          console.log("private checker", message);
          resolve(message.content);
        }
      };
      this.onMessage.add(privateMessageHandler);
    });
    this._websocket.send(JSON.stringify(requestMessage));
    return result;
  }
}
