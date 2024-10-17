import { App, LogLevel } from '@slack/bolt';
import express from 'express';

import { CONFIG } from './constants/constants';
import { registerCommands } from './helpers/registerCommands';
import logger from './utils/logger';

const app = express();

const slackApp = new App({
	signingSecret: CONFIG.SLACK_SIGNING_SECRET,
	appToken: CONFIG.SLACK_APP_TOKEN,
	token: CONFIG.SLACK_BOT_TOKEN,
	logLevel: LogLevel.INFO,
	socketMode: true,
	logger: {
		debug: (msg: string) => logger.debug(msg),
		info: (msg: string) => logger.info(msg),
		warn: (msg: string) => logger.warn(msg),
		error: (msg: string) => logger.error(msg),
		setName: () => {},
		setLevel: () => {},
		getLevel: () => LogLevel.INFO
	}
});

app.use(express.json());

registerCommands(slackApp);

slackApp.start().then(() => {
	logger.info('⚡️ Slack bot is running ⚡️');
});

app.listen(CONFIG.PORT, () => {
	logger.info(`Server is running on http://localhost:${CONFIG.PORT}`);
});
