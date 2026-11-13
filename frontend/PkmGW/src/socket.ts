import { io } from "socket.io-client";
import Buffer from "node:buffer";

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

export function createSocket(){
  return io(import.meta.env.VITE_BACKEND_URL, {autoConnect: false});
}



