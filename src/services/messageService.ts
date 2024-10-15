import { App } from '@slack/bolt';

import logger from '../utils/logger';

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
			logger.info('Message sent', result);
		} catch (error) {
			logger.error('Error sending message:', error);
		}
	}
}
