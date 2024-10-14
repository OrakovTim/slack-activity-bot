import { App } from '@slack/bolt';

export class MessageService {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	async sendMessage(channelId: string, message: string) {
		try {
			const result = await this.app.client.chat.postMessage({
				channel: channelId,
				text: message
			});
			console.log('Message sent:', result);
		} catch (error) {
			console.error('Error sending message:', error);
		}
	}
}
