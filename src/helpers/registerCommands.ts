import { App } from '@slack/bolt';

import { getStopCommand } from '../commands/stop';
import { getTrackCommand } from '../commands/track';
import { getMessageEventHandler } from '../events/messageEvent';
import { MessageService } from '../services/messageService';
import { TrackingService } from '../services/trackingService';
import { UserService } from '../services/userService';

export function registerCommands(app: App) {
	const messageService = new MessageService(app);
	const userService = new UserService(app);
	const trackingService = new TrackingService(messageService);

	app.command('/stop', getStopCommand(trackingService, userService));
	app.command('/track', getTrackCommand(trackingService, userService));
	app.event('message', getMessageEventHandler(trackingService, userService));
}
