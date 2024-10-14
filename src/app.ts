import { App } from '@slack/bolt';
import dotenv from 'dotenv';
import express from 'express';

import { trackCommand } from './commands/track';

dotenv.config();

const app = express();

const slackApp = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	socketMode: true,
	appToken: process.env.SLACK_APP_TOKEN
});

app.use(express.json());

trackCommand(slackApp);

(async () => {
	await slackApp.start();
	console.log('⚡️ Slack bot is running!');
})();

app.listen(6000, () => {
	console.log('Server is running on http://localhost:6000');
});
