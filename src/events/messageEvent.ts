import { App } from '@slack/bolt';

import { TrackingService } from '../services/trackingService';
import { TrackingParams } from '../types';
import logger from '../utils/logger';

export const messageEvent = (app: App) => {
	const trackingService = new TrackingService(app);

	app.event('message', async ({ event }) => {
		if ('user' in event && event.user) {
			const { user, channel } = event;

			const userInfo = await app.client.users.info({ user });
			const name = userInfo.user?.name;

			if (!name) {
				logger.error(`Не удалось получить имя для пользователя ${user}`);
				return;
			}

			const interval = 5000;
			const respond = null;

			const trackingParams: TrackingParams = {
				userId: user,
				name,
				channelId: channel,
				interval,
				respond
			};

			trackingService.resetTracking(trackingParams);
		}
	});
};
