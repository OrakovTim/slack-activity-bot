import { TrackingInfo, TrackingParams } from '../types';

import { MessageService } from './messageService';

const trackingData = new Map<string, TrackingInfo>();

export class TrackingService {
	private messageService: MessageService;

	constructor(app: any) {
		this.messageService = new MessageService(app);
	}

	async startTracking(params: TrackingParams) {
		const { userId, name, channelId, interval } = params;
		const key = `${name}-${channelId}`;

		const timeout = setTimeout(async () => {
			const message = `Пользователь <@${userId}> не был активен в течение ${interval / 1000} секунд.`;
			await this.messageService.sendMessage(channelId, message);
			trackingData.delete(key);
		}, interval);

		trackingData.set(key, { timeout, interval, respond: params.respond, name });
	}

	resetTracking(params: TrackingParams) {
		const { name, channelId } = params;
		const key = `${name}-${channelId}`;

		if (trackingData.has(key)) {
			const { timeout } = trackingData.get(key)!;
			clearTimeout(timeout);
			trackingData.delete(key);
		}

		this.startTracking(params);
	}
}
