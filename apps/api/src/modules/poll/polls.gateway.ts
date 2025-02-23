import {
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { WsExceptionFilter } from 'src/config/exceptions/exceptions.filter';
import { WsUnauthorizedException } from 'src/config/exceptions/ws-exception';
import { SocketWithAuth } from 'src/socket/types/socket-auth.type';
import { PollsService } from './polls.service';
import { GatewayAdminGuard } from '../auth/guards/gateaway-admin.guard';
import { CreateNominationDto } from './dtos/create-nomination.dto';

@UseFilters(WsExceptionFilter)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@WebSocketGateway({
  namespace: 'polls',
})
export class PollsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PollsGateway.name);

  constructor(private readonly pollsService: PollsService) {}

  @WebSocketServer() io: Namespace;

  @SubscribeMessage('test')
  async handleMessage() {
    throw new WsUnauthorizedException('exception');
  }

  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `Socket connected with userID: ${client.userID}, pollID: ${client.pollID}, and name: "${client.name}"`,
    );

    this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    const roomName = client.pollID;
    await client.join(roomName);

    const connectedClients = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    this.logger.debug(
      `userID: ${client.userID} joined room with name: ${roomName}`,
    );
    this.logger.debug(
      `Total clients connected to room '${roomName}': ${connectedClients}`,
    );

    const updatedPoll = await this.pollsService.addParticipant({
      pollID: client.pollID,
      userID: client.userID,
      name: client.name,
    });

    this.io.to(roomName).emit('poll_updated', updatedPoll);
  }

  async handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    const { pollID, userID } = client;
    const pollExists = await this.pollsService.get(pollID).catch(() => null);
    if (!pollExists) {
      this.logger.warn(
        `Poll ${pollID} no existe. No se puede remover participante.`,
      );
      return;
    }
    const updatedPoll = await this.pollsService.removeParticipant({
      pollID,
      userID,
    });

    const roomName = client.pollID;
    const clientCount = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    this.logger.debug(
      `Total clients connected to room '${roomName}': ${clientCount}`,
    );

    if (updatedPoll) {
      this.io.to(pollID).emit('poll_updated', updatedPoll);
    }
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('remove_participant')
  async removeParticipant(
    @MessageBody('id') id: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    this.logger.debug(
      `Attempting to remove participant ${id} from poll ${client.pollID}`,
    );

    const updatedPoll = await this.pollsService.removeParticipant({
      pollID: client.pollID,
      userID: id,
    });

    if (updatedPoll) {
      this.io.to(client.pollID).emit('poll_updated', updatedPoll);
    }
  }

  @SubscribeMessage('nominate')
  async nominate(
    @MessageBody() nomination: CreateNominationDto,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    this.logger.debug(
      `Attempting to add nomination for user ${client.userID} to poll ${client.pollID}\n${nomination.text}`,
    );

    const updatedPoll = await this.pollsService.createNomination({
      pollID: client.pollID,
      userID: client.userID,
      text: nomination.text,
    });

    this.io.to(client.pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('remove_nomination')
  async removeNomination(
    @MessageBody('id') nominationID: string,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    this.logger.debug(
      `Attempting to remove nomination ${nominationID} from poll ${client.pollID}`,
    );

    const updatedPoll = await this.pollsService.removeNomination(
      client.pollID,
      nominationID,
    );

    this.io.to(client.pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('start_poll')
  async startPoll(@ConnectedSocket() client: SocketWithAuth) {
    this.logger.debug(`Attempting to start poll ${client.pollID}`);

    const updatedPoll = await this.pollsService.startPoll(client.pollID);

    this.io.to(client.pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('close_poll')
  async closePoll(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    this.logger.debug(`Closing poll: ${client.pollID} and computing results`);

    const updatedPoll = await this.pollsService.computeResults(client.pollID);

    this.io.to(client.pollID).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('delete_poll')
  async deletePoll(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    this.logger.debug(`Deleting poll with id: ${client.pollID}`);

    await this.pollsService.cancelPoll(client.pollID);

    this.io.to(client.pollID).emit('delete_poll');
  }

  @SubscribeMessage('submit_rankings')
  async submitRankings(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody('rankings') rankings: string[],
  ): Promise<void> {
    this.logger.debug(
      `Submitting votes for user: ${client.userID} belonging to pollID: "${client.pollID}"`,
    );

    const updatedPoll = await this.pollsService.submitRankings({
      pollID: client.pollID,
      userID: client.userID,
      rankings,
    });

    // an enhancement might be to not send ranking data to clients,
    // but merely a list of the participants who have voted since another
    // participant getting this data could lead to cheating
    // we may add this while working on the client
    this.io.to(client.pollID).emit('poll_updated', updatedPoll);
  }

  afterInit() {
    this.logger.log('Init');
  }
}
