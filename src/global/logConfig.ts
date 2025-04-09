export function getLogSettings(): {
    logDir: string;
    maxLogDirSize: number;
    logLevel: 'info' | 'warn' | 'error';
} {
    return {
        logDir: process.env.LOG_DIR || 'logs',
        maxLogDirSize: parseInt(process.env.LOG_MAX_SIZE || '5242880'),
        logLevel: (process.env.LOG_LEVEL || 'info') as 'info' | 'warn' | 'error',
    };
}
