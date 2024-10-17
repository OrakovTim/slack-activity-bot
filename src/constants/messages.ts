export const TRACKING_MESSAGES = {
	START_TRACKING: (userName: string, channelId: string, interval: number) =>
		`Таймер для пользователя <@${userName}> в канале ${channelId} запущен. Таймер: ${interval / 60000} минут.`,

	STOP_TRACKING: (userName: string, channelId: string) =>
		`Отслеживание активности для <@${userName}> в канале ${channelId} остановлено.`,

	USER_INACTIVE: (userId: string, interval: number) =>
		`Пользователь <@${userId}> не был активен в течение ${interval / 60000} минут.`,

	USER_NOT_FOUND: (name: string) =>
		`Пользователь с именем <@${name}> не найден.`,

	RESTART_TRACKING: (userId: string, channelId: string) =>
		`Перезапуск таймера для <@${userId}> в канале ${channelId}`,

	ERROR: (error: string) => `Произошла ошибка: ${error}`,

	USER_NAME_NOT_FOUND: (userId: string) =>
		`Не удалось получить имя для пользователя ${userId}.`,

	USER_INFO_NOT_FOUND: `Не удалось найти информацию о пользователе.`,

	NOT_TRACKING: (userId: string) =>
		`Пользователь <@${userId}> не отслеживается.`,

	ERROR_LOG: (error: unknown) => `Ошибка при обработке команды: ${error}`,

	ERROR_MESSAGE: `Произошла ошибка при остановке отслеживания.`,

	TRACK_START_MESSAGE: (userName: string, interval: number) =>
		`Отслеживание активности пользователя <@${userName}> началось. Таймер: ${interval / 60000} минут.`
};

export const TRACK_COMMAND_MESSAGES = {
	USER_NOT_FOUND: (name: string) =>
		`Пользователь с именем <@${name}> не найден.`,

	START_TRACKING: (userName: string, interval: number) =>
		`Отслеживание активности пользователя <@${userName}> началось. Таймер: ${interval / 60000} минут.`
};

export const MESSAGE_EVENT_MESSAGES = {
	USER_NAME_NOT_FOUND: (user: string) =>
		`Не удалось получить имя для пользователя ${user}`,

	USER_SENT_MESSAGE: (user: string) =>
		`Пользователь ${user} отправил сообщение, таймер перезапущен`,

	ERROR_MESSAGE: (error: unknown) => `Ошибка при обработке сообщения: ${error}`
};

export const VALIDATION_MESSAGES = {
	TIME_ISNAN_MESSAGE: 'Пожалуйста, укажите корректное время в минутах',

	INCORRECT_ARGS: 'Пожалуйста, укажите имя пользователя и время в минутах',

	INCORRECT_NAME_MESSAGE:
		'Пожалуйста, укажите имя пользователя для остановки отслеживания.'
};

export const MESSAGE_SERVICE_INFO = {
	SUCCESS_MESSAGE: (channel: string, text: string) =>
		`Сообщение отправлено в канал ${channel}: ${text}`,

	ERROR_MESSAGE: (channel: string, error: unknown) =>
		`Ошибка при отправке сообщения в канал ${channel}: ${error}`
};

export const GET_USER_MESSAGES = {
	ERROR_MESSAGE: (error: unknown) =>
		`Ошибка при получении пользователя по имени: ${error}`,

	USER_NOT_FOUND: (name: string) =>
		`Пользователь с именем <@${name}> не найден.`,

	FAILED_LIST_MESSAGE: 'Не удалось получить список пользователей'
};
