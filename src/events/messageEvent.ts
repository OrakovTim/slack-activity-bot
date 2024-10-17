import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';

import { MESSAGE_EVENT_MESSAGES } from '../constants/messages';
import { TrackingService } from '../services/trackingService';
import { UserService } from '../services/userService';
import logger from '../utils/logger';

export const getMessageEventHandler = (
	trackingService: TrackingService,
	userService: UserService
) => {
	const handler: Middleware<
		SlackEventMiddlewareArgs<'message'>,
		StringIndexed
	> = async ({ event }) => {
		if ('user' in event && event.user) {
			const { user, channel } = event;

			try {
				const userInfo = await userService.getUserInfo(user);

				if (!userInfo) {
					logger.error(MESSAGE_EVENT_MESSAGES.USER_NAME_NOT_FOUND);
					return;
				}
				const name = userInfo.name;

				const key = `${name}-${channel}`;

				if (trackingService.isTracking(key)) {
					logger.info(MESSAGE_EVENT_MESSAGES.USER_SENT_MESSAGE(user));

					const trackingInfo = trackingService.getTrackingInfo(key);

					if (trackingInfo) {
						trackingService.restartTracking({
							userId: trackingInfo.userId,
							name: trackingInfo.name,
							channelId: channel,
							interval: trackingInfo.interval,
							respond: trackingInfo.respond
						});
					}
				}
			} catch (error) {
				logger.error(MESSAGE_EVENT_MESSAGES.ERROR_MESSAGE(error));
			}
		}
	};

	return handler;
};
