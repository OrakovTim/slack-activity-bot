import { IValidation } from '../types';

export const validationTrack = (args: string[]): IValidation | string => {
	if (args.length < 2) {
		return 'Пожалуйста, укажите имя пользователя и время в минутах.';
	}
	const name = args[0].replace(/^@/, '');
	const interval = parseInt(args[1], 10) * 60 * 1000;

	if (isNaN(interval) || interval <= 0) {
		return 'Пожалуйста, укажите корректное время в минутах.';
	}
	return { name, interval };
};
