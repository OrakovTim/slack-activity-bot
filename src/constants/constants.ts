import dotenv from 'dotenv';

dotenv.config({
	path:
		process.env.NODE_ENV === 'production'
			? '.env.production'
			: '.env.development'
});

export const CONFIG = {
	SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN,
	SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
	SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
	PORT: process.env.PORT || 3000
};
