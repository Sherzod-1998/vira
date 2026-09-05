import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import * as url from 'url';
import { AuthService } from '../components/auth/auth.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketGateway');

	// client ↔ member map
	private clients = new Map<WebSocket, any>();

	constructor(private authService: AuthService) {}

	@WebSocketServer()
	server: Server;

	private toPublicMember(member: any) {
		if (!member) return null;
		return {
			_id: member._id,
			memberNick: member.memberNick,
		};
	}

	afterInit() {
		this.logger.verbose(`WebSocket initialized`);
	}

	private async getAuth(req: any) {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			if (!token) return null;
			return await this.authService.verifyToken(String(token));
		} catch (e) {
			this.logger.error('getAuth error', e);
			return null;
		}
	}

	/** 🔥 Hamma clientlarga event yuborish */
	private broadcast(message: any) {
		const json = JSON.stringify(message);
		this.clients.forEach((_member, socket) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(json);
			}
		});
	}

	async handleConnection(client: WebSocket, req: any) {
		// Legacy fallback: a token in the connection URL query string still works
		// (older clients, or a rollback), but the frontend now prefers sending the
		// token in a post-connect 'auth' message instead, so it never lands in a
		// URL (proxy/server access logs, browser history).
		const member = await this.getAuth(req);
		this.clients.set(client, member);

		this.logger.verbose(`Connected: ${member?.memberNick ?? 'Guest'}. Total: ${this.clients.size}`);

		this.broadcast({
			event: 'info',
			totalClients: this.clients.size,
			memberData: this.toPublicMember(member),
			action: 'connect',
		});

		client.on('message', (raw: WebSocket.RawData) => {
			try {
				const data = JSON.parse(raw.toString());
				const currentMember = this.clients.get(client);
				this.logger.verbose(`Message from ${currentMember?.memberNick ?? 'Guest'}: ${raw.toString()}`);

				if (data.event === 'auth' && data.token) {
					this.authService
						.verifyToken(String(data.token))
						.then((verifiedMember) => {
							this.clients.set(client, verifiedMember);
							this.logger.verbose(`Authenticated via message: ${verifiedMember?.memberNick}`);
							this.broadcast({
								event: 'info',
								totalClients: this.clients.size,
								memberData: this.toPublicMember(verifiedMember),
								action: 'connect',
							});
						})
						.catch((e) => this.logger.error('auth message verify error', e));
					return;
				}

				if (data.event === 'message') {
					this.broadcast({
						event: 'message',
						text: data.data,
						memberData: this.toPublicMember(this.clients.get(client)),
					});
				}
			} catch (e) {
				this.logger.error('message parse error', e);
			}
		});

		client.on('close', () => this.handleDisconnect(client));
		client.on('error', () => this.handleDisconnect(client));
	}

	handleDisconnect(client: WebSocket) {
		const member = this.clients.get(client);
		this.clients.delete(client);

		this.logger.verbose(`Disconnected: ${member?.memberNick ?? 'Guest'}. Total: ${this.clients.size}`);

		this.broadcast({
			event: 'info',
			totalClients: this.clients.size,
			memberData: this.toPublicMember(member),
			action: 'disconnect',
		});
	}

	emitToMember(memberId: string, message: any) {
		this.clients.forEach((member, socket) => {
			if (member?._id == memberId && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify(message));
			}
		});
	}
}
