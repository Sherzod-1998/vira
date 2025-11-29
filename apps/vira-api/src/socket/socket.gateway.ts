import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import * as url from 'url';
import { AuthService } from '../components/auth/auth.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketGateway');
	private clients = new Map<WebSocket, any>();

	constructor(private authService: AuthService) {}

	@WebSocketServer()
	server: Server;

	afterInit() {
		this.logger.verbose(`WebSocket initialized`);
	}

	private async getAuth(req: any) {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			return await this.authService.verifyToken(String(token));
		} catch {
			return null;
		}
	}

	async handleConnection(client: WebSocket, req: any) {
		const member = await this.getAuth(req);
		this.clients.set(client, member);

		this.logger.verbose(`Connected: ${member?.memberNick ?? 'Guest'}`);
	}

	handleDisconnect(client: WebSocket) {
		this.clients.delete(client);
	}

	/* 🔥 Send event to specific member */
	emitToMember(memberId: string, message: any) {
		this.clients.forEach((member, socket) => {
			if (member?._id == memberId) {
				socket.send(JSON.stringify(message));
			}
		});
	}
}
