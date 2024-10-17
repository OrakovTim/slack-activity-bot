import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';

import { TRACKING_MESSAGES } from '../constants/messages';
import { parseArgs } from '../helpers/parseArgs';
import { TrackingService } from '../services/trackingService';
import { UserService } from '../services/userService';
import logger from '../utils/logger';

export const getTrackCommand = (
	trackingService: TrackingService,
	userService: UserService
) => {
	const handler: Middleware<
		SlackCommandMiddlewareArgs,
		StringIndexed
	> = async ({ command, ack, respond }) => {
		await ack();

		const args = command.text.trim().split(' ');
		const parsedArgs = parseArgs(args);

		if ('error' in parsedArgs) {
			await respond(parsedArgs.error);

			return;
		}

		const { name, interval } = parsedArgs;

		const userId = await userService.getUserIdByName(name);

		if (!userId) {
			await respond(TRACKING_MESSAGES.USER_NOT_FOUND(name));

			return;
		}

		await trackingService.startTracking({
			userId,
			name,
			channelId: command.channel_id,
			interval,
			respond
		});

		logger.info(TRACKING_MESSAGES.TRACK_START_MESSAGE(name, interval));

		await respond(TRACKING_MESSAGES.TRACK_START_MESSAGE(name, interval));
	};

	return handler;
};
