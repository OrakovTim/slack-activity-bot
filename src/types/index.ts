export interface TrackingInfo {
	userId: string;
	timeout: NodeJS.Timeout;
	interval: number;
	respond?: (message: string) => Promise<void>;
	name: string;
}

export interface IParsedArgsResult {
	name: string;
	interval: number;
}
export interface IParsedArgsError {
	error: string;
}

export interface TrackingParams {
	userId: string;
	name: string;
	channelId: string;
	interval: number;
	respond?: (message: string) => Promise<void>;
}

export interface StopTrackingParams {
	userId: string;
	name: string;
	channelId: string;
}
