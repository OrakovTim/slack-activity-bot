import { App } from '@slack/bolt';

import { MessageService } from '../services/messageService';

interface TrackingInfo {
	timeout: NodeJS.Timeout;
	interval: number;
	respond: any;
}

const trackingData = new Map<string, TrackingInfo>();

export const trackCommand = (app: App) => {
	const messageService = new MessageService(app);

	app.command('/track', async ({ command, ack, respond }) => {
		await ack();
		const args = command.text.trim().split(' ');

		console.log('Args:', args);
		const userId = args[0];

		console.log('userID', userId);
		const interval = parseInt(args[1], 10) * 60 * 1000 || 10000 || 6000;
		const channelId = command.channel_id;

		console.log('channelId', channelId);

		if (isNaN(interval) || interval <= 0) {
			await respond('Пожалуйста, укажите корректное время в минутах.');
			return;
		}

		startTracking(userId, channelId, interval, messageService, respond);

		await respond(
			`Отслеживание активности пользователя <@${userId}> началось. Таймер: ${args[1]} минут.`
		);
	});

	app.event('message', async ({ event }) => {
		if ('user' in event && event.user) {
			const { user, channel } = event;
			console.log(`Message received from user: ${user} in channel: ${channel}`);

			// Проверяем, есть ли активное отслеживание для пользователя
			const key = `${user}-${channel}`;
			if (trackingData.has(key)) {
				const { interval, respond } = trackingData.get(key)!;
				resetTracking(user, channel, interval, messageService, respond);
			} else {
				console.log(
					`No active tracking found for user: ${user} in channel: ${channel}`
				);
			}
		}
	});
};

const startTracking = (
	userId: string,
	channelId: string,
	interval: number,
	messageService: MessageService,
	respond: any
) => {
	const key = `${userId}-${channelId}`;
	const timeout = setTimeout(async () => {
		const message = `User <@${userId}> has not been active for ${interval / 1000} seconds.`;
		await messageService.sendMessage(channelId, message);
		trackingData.delete(key);
	}, interval);

	trackingData.set(key, { timeout, interval, respond });
};

const resetTracking = (
	userId: string,
	channelId: string,
	interval: number,
	messageService: MessageService,
	respond: any
) => {
	const key = `${userId}-${channelId}`;
	if (trackingData.has(key)) {
		const { timeout } = trackingData.get(key)!;
		clearTimeout(timeout); // Очистить текущий таймер
		trackingData.delete(key); // Удалить запись

		console.log(
			`Resetting tracking for user: ${userId} in channel: ${channelId}`
		);
	}

	startTracking(userId, channelId, interval, messageService, respond);
};
