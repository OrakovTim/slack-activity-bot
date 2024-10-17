import { VALIDATION_MESSAGES } from '../constants/messages';
import { IParsedArgsError, IParsedArgsResult } from '../types';

export const parseArgs = (
	args: string[]
): IParsedArgsResult | IParsedArgsError => {
	if (args.length < 2) {
		return {
			error: VALIDATION_MESSAGES.INCORRECT_ARGS
		};
	}

	const name = args[0].replace('@', '');
	const interval = parseInt(args[1], 10) * 60 * 1000;

	if (isNaN(interval) || interval <= 0) {
		return { error: VALIDATION_MESSAGES.TIME_ISNAN_MESSAGE };
	}

	return { name, interval };
};
