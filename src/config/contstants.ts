import dotenv from 'dotenv';

dotenv.config({
	path:
		process.env.NODE_ENV === 'production'
			? '.env.production'
			: '.env.development'
});

export const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
export const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
export const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
export const PORT = process.env.PORT || 3000;
