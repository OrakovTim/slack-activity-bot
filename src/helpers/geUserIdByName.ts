import { App } from '@slack/bolt';

import logger from '../utils/logger';

export const getUserIdByName = async (
	app: App,
	name: string
): Promise<string | null> => {
	try {
		const result = await app.client.users.list();

		if (!result.members) {
			logger.error('Не удалось получить список пользователей');
			return null;
		}

		const user = result.members.find(member => member.name === name);

		if (!user || !user.id) {
			logger.error(`Пользователь с именем <@${name}>не найден.`);
			return null;
		}

		return user.id;
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error(
				`Ошибка при получении пользователя по имени: ${error.message}`
			);
			return null;
		} else {
			logger.error('Неизвестная ошибка');
			return null;
		}
	}
};
