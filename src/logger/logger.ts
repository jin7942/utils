/**
 * 커스텀 로거 유틸리티
 * 콘솔 및 로그 파일에 로그를 출력함
 * - 로그 레벨: info, warn, error
 * - 로그 파일은 날짜별로 저장되며 자동 용량 관리됨
 */

import { appendToFile } from '../fs/fsHelper';
import { getLogSettings } from '../global/logConfig';

/**
 * 지원되는 로그 레벨
 */
type LogLevel = 'info' | 'warn' | 'error';

const LEVELS: LogLevel[] = ['info', 'warn', 'error'];

/**
 * 현재 로그 레벨에서 해당 레벨을 출력할 수 있는지 확인
 * @param level 출력하려는 레벨
 * @param current 현재 설정된 로그 레벨
 */
function shouldLog(level: LogLevel, current: LogLevel): boolean {
    return LEVELS.indexOf(level) >= LEVELS.indexOf(current);
}

/**
 * 콘솔용 로그 포맷 생성 (ANSI 색상 포함)
 * @param level 로그 레벨
 * @param message 출력할 메시지
 */
function formatConsole(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const color = {
        info: '\x1b[32m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
    }[level];

    return `${color}[UTILS][${level.toUpperCase()}][${timestamp}] ${message}\x1b[0m`;
}

/**
 * 파일용 로그 포맷 생성 (텍스트 전용)
 * @param level 로그 레벨
 * @param message 메시지
 */
function formatFile(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${level.toUpperCase()}][${timestamp}] ${message}`;
}

/**
 * 오늘 날짜 기반 로그 파일명 생성
 * @returns 예: "2025-04-09.log"
 */
function getLogFileName(): string {
    return `${new Date().toISOString().slice(0, 10)}.log`;
}

/**
 * 전역 로거 객체
 */
export const logger = {
    /**
     * 정보 로그 출력
     * @param msg 로그 메시지
     */
    info: (msg: string): void => {
        const { logLevel, logDir } = getLogSettings();
        if (shouldLog('info', logLevel)) {
            console.log(formatConsole('info', msg));
            appendToFile(logDir, getLogFileName(), formatFile('info', msg));
        }
    },

    /**
     * 경고 로그 출력
     * @param msg 로그 메시지
     */
    warn: (msg: string): void => {
        const { logLevel, logDir } = getLogSettings();
        if (shouldLog('warn', logLevel)) {
            console.warn(formatConsole('warn', msg));
            appendToFile(logDir, getLogFileName(), formatFile('warn', msg));
        }
    },

    /**
     * 에러 로그 출력
     * @param msg 문자열 또는 Error 객체
     */
    error: (msg: string | Error): void => {
        const { logLevel, logDir } = getLogSettings();
        const full = msg instanceof Error ? `${msg.message}\n${msg.stack}` : msg;
        if (shouldLog('error', logLevel)) {
            console.error(formatConsole('error', full));
            appendToFile(logDir, getLogFileName(), formatFile('error', full));
        }
    },
};
