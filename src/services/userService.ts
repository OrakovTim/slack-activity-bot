import { App } from '@slack/bolt';

import { GET_USER_MESSAGES } from '../constants/messages';
import logger from '../utils/logger';

// SDK doesnt export this type
type UsersInfoResponse = Awaited<ReturnType<App['client']['users']['info']>>;

export class UserService {
	constructor(private readonly app: App) {}

	private readonly userInfoCache = new Map<
		string,
		NonNullable<UsersInfoResponse['user']>
	>();

	async getUserIdByName(name: string): Promise<string | null> {
		try {
			const result = await this.app.client.users.list();

			if (!result.members) {
				logger.error(GET_USER_MESSAGES.FAILED_LIST_MESSAGE);

				return null;
			}

			const user = result.members.find(member => member.name === name);

			if (!user || !user.id) {
				logger.error(GET_USER_MESSAGES.USER_NOT_FOUND(name));

				return null;
			}

			return user.id;
		} catch (error) {
			logger.error(GET_USER_MESSAGES.ERROR_MESSAGE(error));

			return null;
		}
	}

	async getUserInfo(userId: string) {
		const cached = this.userInfoCache.get(userId);

		if (cached) {
			return cached;
		}

		const response = await this.app.client.users.info({ user: userId });

		if (!response.ok || !response.user) {
			return null;
		}

		this.userInfoCache.set(userId, response.user);

		return response.user;
	}
}
