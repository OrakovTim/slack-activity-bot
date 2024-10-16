import { App } from '@slack/bolt';

import { getUserIdByName } from '../helpers/geUserIdByName';
import { validationTrack } from '../helpers/validation';
import { TrackingService } from '../services/trackingService';
import { TrackingParams } from '../types';
import logger from '../utils/logger';

export const trackCommand = (app: App) => {
	const trackingService = new TrackingService(app);

	app.command('/track', async ({ command, ack, respond }) => {
		await ack();
		const args = command.text.trim().split(' ');

		const validationResult = validationTrack(args);
		if (typeof validationResult === 'string') {
			await respond(validationResult);
			return;
		}

		const { name, interval } = validationResult;

		const userId = await getUserIdByName(app, name);
		if (!userId) {
			await respond(`Пользователь с именем <@${name}> не найден.`);
			return;
		}

		const trackingParams: TrackingParams = {
			userId,
			name,
			channelId: command.channel_id,
			interval,
			respond
		};

		await trackingService.startTracking(trackingParams);

		logger.info(
			`Отслеживание активности пользователя <@${name}> началось. Таймер: ${args[1]} минут.`
		);
		await respond(
			`Отслеживание активности пользователя <@${name}> началось. Таймер: ${args[1]} минут.`
		);
	});
};
