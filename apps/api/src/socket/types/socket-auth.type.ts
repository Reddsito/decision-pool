import { Socket } from 'socket.io';
import { AuthPayload } from 'src/modules/auth/types/auth.types';

export type SocketWithAuth = Socket & AuthPayload;
