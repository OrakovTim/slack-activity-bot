import { App } from '@slack/bolt';

export const getUserIdByName = async (
	app: App,
	name: string
): Promise<string | null> => {
	try {
		const result = await app.client.users.list();

		if (!result.members) {
			console.error('Не удалось получить список пользователей');
			return null;
		}

		const user = result.members.find(member => member.name === name);

		console.log('user find', user);

		if (!user || !user.id) {
			console.error(`Пользователь с именем <@${name}>не найден.`);
			return null;
		}

		return user.id;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(
				`Ошибка при получении пользователя по имени: ${error.message}`
			);
			return null;
		} else {
			console.error('Неизвестная ошибка');
			return null;
		}
	}
};
