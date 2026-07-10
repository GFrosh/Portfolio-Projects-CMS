type LoggerPayload = Record<string, unknown>;

function format(prefix: string, message: string, payload?: LoggerPayload): string {
	if (!payload || Object.keys(payload).length === 0) {
		return `${prefix} ${message}`;
	}

	return `${prefix} ${message} ${JSON.stringify(payload)}`;
}

const logger = {
	info(message: string, payload?: LoggerPayload) {
		console.log(format('[INFO]', message, payload));
	},

	warn(message: string, payload?: LoggerPayload) {
		console.warn(format('[WARN]', message, payload));
	},

	error(message: string, payload?: LoggerPayload) {
		console.error(format('[ERROR]', message, payload));
	},

	debug(message: string, payload?: LoggerPayload) {
		console.debug(format('[DEBUG]', message, payload));
	}
};

export default logger;
