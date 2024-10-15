import { App } from '@slack/bolt';
import express from 'express';

import { trackCommand } from './commands/track';
import {
	PORT,
	SLACK_APP_TOKEN,
	SLACK_BOT_TOKEN,
	SLACK_SIGNING_SECRET
} from './config/constants';
import { messageEvent } from './events/messageEvent';
import logger from './utils/logger';

const app = express();

const slackApp = new App({
	token: SLACK_BOT_TOKEN,
	signingSecret: SLACK_SIGNING_SECRET,
	socketMode: true,
	appToken: SLACK_APP_TOKEN
});

app.use(express.json());

trackCommand(slackApp);
messageEvent(slackApp);

(async () => {
	await slackApp.start();
	logger.info('⚡️ Slack bot is running!');
})();

app.listen(PORT, () => {
	logger.info(`Server is running on http://localhost:${PORT}`);
});
