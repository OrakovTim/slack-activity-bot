import { App } from '@slack/bolt';

import { getUserIdByName } from '../helpers/geUserIdByName';
import { MessageService } from '../services/messageService';

interface TrackingInfo {
	timeout: NodeJS.Timeout;
	interval: number;
	respond: any;
	name: string;
}

const trackingData = new Map<string, TrackingInfo>();

console.log('trackingData', trackingData);

export const trackCommand = (app: App) => {
	const messageService = new MessageService(app);

	app.command('/track', async ({ command, ack, respond }) => {
		await ack();
		const args = command.text.trim().split(' ');

		if (args.length < 2) {
			await respond('Пожалуйста, укажите имя пользователя и время в минутах.');
			return;
		}

		const name = args[0].replace(/^@/, '');
		const interval = parseInt(args[1], 10) * 60 * 1000 || 10000 || 6000;
		const channelId = command.channel_id;

		if (isNaN(interval) || interval <= 0) {
			await respond('Пожалуйста, укажите корректное время в минутах.');
			return;
		}

		// Получаем userId по имени пользователя
		const userId = await getUserIdByName(app, name);

		if (!userId) {
			await respond(`Пользователь с именем ${name} не найден.`);
			return;
		}

		startTracking(userId, name, channelId, interval, messageService, respond);

		await respond(
			`Отслеживание активности пользователя с именем <@${name}> началось. Таймер: ${args[1]} минут.`
		);
	});

	app.event('message', async ({ event }) => {
		if ('user' in event && event.user) {
			const { user, channel } = event;

			// Получаем информацию о пользователе по userId
			const userInfo = await app.client.users.info({ user });
			const name = userInfo.user?.name;

			if (!name) {
				console.log(`Не удалось получить имя для пользователя ${user}`);
				return;
			}

			const key = `${name}-${channel}`;
			if (trackingData.has(key)) {
				const { interval, respond } = trackingData.get(key)!;
				resetTracking(user, name, channel, interval, messageService, respond);
			} else {
				console.log(
					`No active tracking found for name: <@${name}> in channel: ${channel}`
				);
			}
		}
	});
};

const startTracking = (
	userId: string,
	name: string,
	channelId: string,
	interval: number,
	messageService: MessageService,
	respond: any
) => {
	const key = `${name}-${channelId}`;
	const timeout = setTimeout(async () => {
		const message = `Пользователь <@${userId}> не был активен в течение ${interval / 1000} секунд.`;
		await messageService.sendMessage(channelId, message);
		trackingData.delete(key);
	}, interval);

	trackingData.set(key, { timeout, interval, respond, name });
};

const resetTracking = (
	userId: string,
	name: string,
	channelId: string,
	interval: number,
	messageService: MessageService,
	respond: any
) => {
	const key = `${name}-${channelId}`;
	if (trackingData.has(key)) {
		const { timeout } = trackingData.get(key)!;
		clearTimeout(timeout); // Очистить текущий таймер
		trackingData.delete(key); // Удалить запись

		console.log(
			`Сброс отслеживания для имени: <@${name}> в канале: ${channelId}`
		);
	}

	startTracking(userId, name, channelId, interval, messageService, respond);
};
