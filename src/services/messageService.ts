import { App } from '@slack/bolt';

import { MESSAGE_SERVICE_INFO } from '../constants/messages';
import logger from '../utils/logger';

export class MessageService {
	constructor(private readonly app: App) {}

	async sendMessage(channel: string, text: string) {
		try {
			await this.app.client.chat.postMessage({
				channel,
				text
			});

			logger.info(MESSAGE_SERVICE_INFO.SUCCESS_MESSAGE(channel, text));
		} catch (error) {
			logger.error(MESSAGE_SERVICE_INFO.ERROR_MESSAGE(channel, error));
		}
	}
}
