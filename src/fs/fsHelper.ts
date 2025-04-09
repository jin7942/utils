/**
 * 파일 시스템 관련 유틸 함수 모음
 */

import fs from 'fs/promises';
import path from 'path';
import { getLogSettings } from '../global/logConfig';

/**
 * 디렉토리가 존재하지 않으면 생성
 * @param dirPath 생성할 디렉토리 경로
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
        console.warn('[fsHelper] 디렉토리 생성 실패:', err);
    }
}

/**
 * 파일에 로그 추가 (줄바꿈 포함)
 * - 자동으로 디렉토리 생성
 * - 로그 디렉토리 용량 초과 시 오래된 로그 제거
 *
 * @param dir 로그 디렉토리 경로
 * @param filename 로그 파일명
 * @param content 저장할 문자열
 */
export async function appendToFile(dir: string, filename: string, content: string): Promise<void> {
    await ensureDirectoryExists(dir);
    const fullPath = path.join(dir, filename);

    try {
        await fs.appendFile(fullPath, content + '\n', 'utf-8');
    } catch (err) {
        console.warn('[fsHelper] 로그 파일 쓰기 실패:', err);
    }

    const { maxLogDirSize } = getLogSettings();
    trimLogsIfTooLarge(dir, maxLogDirSize).catch((e) => console.warn('[fsHelper] 로그 정리 실패:', e));
}

/**
 * 파일을 문자열로 읽기 (UTF-8)
 * @param filePath 파일 경로
 * @returns 파일 내용 문자열
 */
export async function readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
}

/**
 * 주어진 경로에 파일이 존재하는지 확인
 * @param filePath 확인할 파일 경로
 * @returns 존재 여부
 */
export async function exists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * 디렉토리 내 로그 파일 용량을 확인하고, 최대 용량 초과 시 오래된 로그부터 제거
 * @param dir 로그 디렉토리
 * @param maxSizeBytes 최대 허용 용량 (바이트)
 */
async function trimLogsIfTooLarge(dir: string, maxSizeBytes: number): Promise<void> {
    try {
        const entries = await fs.readdir(dir);
        const logFiles = await Promise.all(
            entries
                .filter((f: string) => f.endsWith('.log'))
                .map(async (file: string) => {
                    const stat = await fs.stat(path.join(dir, file));
                    return { name: file, time: stat.mtime.getTime(), size: stat.size };
                })
        );

        logFiles.sort((a, b) => a.time - b.time);
        let totalSize = logFiles.reduce((sum, f) => sum + f.size, 0);

        while (totalSize > maxSizeBytes && logFiles.length > 0) {
            const toDelete = logFiles.shift();
            if (!toDelete) break;

            await fs.unlink(path.join(dir, toDelete.name));
            totalSize -= toDelete.size;
        }
    } catch (err) {
        console.warn('[fsHelper] 로그 정리 실패:', err);
    }
}
