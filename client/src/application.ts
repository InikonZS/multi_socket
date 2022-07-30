import Control from './common/control';
import { ClientSocket } from './clientSocket';

export class Application extends Control{
    socket: ClientSocket;

    constructor(parentNode: HTMLElement) {
      super(parentNode, 'div');
      this.socket = new ClientSocket('ws://localhost:3000');

      this.socket.onMessage.add((msg)=>{
        console.log(msg);
      });

      const sendButton = new Control(this.node, 'button', '', 'send');
      sendButton.node.onclick = ()=>{
        this.socket.sendMessage('test', 'hello');
      }
    }
}