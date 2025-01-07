declare module 'roslib' {
    export class Ros {
      constructor(options: { url: string });
      on(eventName: string, callback: (data: any) => void): void;
      close(): void;
    }
  
    export class Topic {
      constructor(options: { ros: Ros; name: string; messageType: string });
      publish(message: Message): void;
      subscribe(callback: (message: any) => void): void;
      unsubscribe(): void;
    }
  
    export class Message {
      constructor(values: { [key: string]: any });
    }
  }
  