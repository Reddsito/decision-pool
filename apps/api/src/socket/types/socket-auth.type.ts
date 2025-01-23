import { Socket } from 'socket.io';
import { AuthPayload } from 'src/modules/auth/interfaces/auth-payload.interface';

export type SocketWithAuth = Socket & AuthPayload;
