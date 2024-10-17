import { TRACKING_MESSAGES } from '../constants/messages';
import { StopTrackingParams, TrackingInfo, TrackingParams } from '../types';
import logger from '../utils/logger';

import { MessageService } from './messageService';

export class TrackingService {
	constructor(private readonly messageService: MessageService) {}

	private readonly trackingData = new Map<string, TrackingInfo>();

	async startTracking(params: TrackingParams) {
		const { userId, name, channelId, interval } = params;
		const key = `${name}-${channelId}`;

		const startInterval = () => {
			if (this.trackingData.has(key)) {
				const { timeout } = this.trackingData.get(key)!;

				clearTimeout(timeout);
			}

			const timeout = setTimeout(async () => {
				await this.trackUserActivity(channelId, userId, interval);

				startInterval();
			}, interval);

			this.trackingData.set(key, {
				userId,
				timeout,
				interval,
				respond: params.respond,
				name
			});

			logger.info(TRACKING_MESSAGES.START_TRACKING(name, channelId, interval));
		};

		startInterval();
	}

	restartTracking(params: TrackingParams) {
		const { name, channelId } = params;
		const key = `${name}-${channelId}`;

		if (this.trackingData.has(key)) {
			const { timeout } = this.trackingData.get(key)!;

			clearTimeout(timeout);

			logger.info(TRACKING_MESSAGES.RESTART_TRACKING(name, channelId));

			this.startTracking(params);
		}
	}

	stopTracking(params: StopTrackingParams) {
		const { name, channelId } = params;
		const key = `${name}-${channelId}`;

		if (this.trackingData.has(key)) {
			const { timeout } = this.trackingData.get(key)!;

			clearTimeout(timeout);

			this.trackingData.delete(key);

			logger.info(TRACKING_MESSAGES.STOP_TRACKING(name, channelId));
		}
	}

	isTracking(key: string): boolean {
		return this.trackingData.has(key);
	}

	getTrackingInfo(key: string): TrackingInfo | undefined {
		return this.trackingData.get(key);
	}

	private async trackUserActivity(
		channelId: string,
		userId: string,
		interval: number
	) {
		const message = TRACKING_MESSAGES.USER_INACTIVE(userId, interval);

		logger.info(TRACKING_MESSAGES.USER_INACTIVE(userId, interval));

		await this.messageService.sendMessage(channelId, message);
	}
}
