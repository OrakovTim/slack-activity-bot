import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';

import { TRACKING_MESSAGES, VALIDATION_MESSAGES } from '../constants/messages';
import { TrackingService } from '../services/trackingService';
import { UserService } from '../services/userService';
import logger from '../utils/logger';

export const getStopCommand = (
	trackingService: TrackingService,
	userService: UserService
) => {
	const handler: Middleware<
		SlackCommandMiddlewareArgs,
		StringIndexed
	> = async ({ command, ack, respond }) => {
		await ack();

		const { channel_id: channelId } = command;
		const args = command.text.trim().split(' ');

		if (!args.length) {
			return respond(VALIDATION_MESSAGES.INCORRECT_NAME_MESSAGE);
		}

		const userName = args[0].replace('@', '');

		try {
			const userId = await userService.getUserIdByName(userName);

			if (!userId) {
				return respond(TRACKING_MESSAGES.USER_NOT_FOUND(userName));
			}

			const userInfo = await userService.getUserInfo(userId);

			if (!userInfo) {
				return respond(TRACKING_MESSAGES.USER_NOT_FOUND(userName));
			}

			const name = userInfo.name!;

			const key = `${name}-${channelId}`;

			if (trackingService.isTracking(key)) {
				trackingService.stopTracking({
					userId,
					name,
					channelId
				});

				await respond(TRACKING_MESSAGES.STOP_TRACKING(name, channelId));

				return logger.info(TRACKING_MESSAGES.STOP_TRACKING(name, channelId));
			}

			await respond(TRACKING_MESSAGES.NOT_TRACKING(userId));

			logger.info(TRACKING_MESSAGES.NOT_TRACKING(name));
		} catch (error) {
			logger.error(TRACKING_MESSAGES.ERROR_LOG(error));

			await respond(TRACKING_MESSAGES.ERROR_MESSAGE);
		}
	};

	return handler;
};
