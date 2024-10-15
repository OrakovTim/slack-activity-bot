export interface TrackingInfo {
	timeout: NodeJS.Timeout;
	interval: number;
	respond: any;
	name: string;
}

export interface IValidation {
	name: string;
	interval: number;
}

export interface TrackingParams {
	userId: string;
	name: string;
	channelId: string;
	interval: number;
	respond: any;
}
