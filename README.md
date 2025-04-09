# @jin7942/utils

파일 시스템 작업 및 로깅 기능을 지원하는 경량 유틸리티 모듈입니다.  
CLI 도구, 배포 도구, 자동화 스크립트 등에 사용하기 좋도록 설계되었습니다.

---

## 설치

```bash
npm install @jin7942/utils
```

---

## 문서

[DOCUMENT](./docs/READEME.md)

## 제공 기능

### 파일 유틸 (fsHelper)

| 함수                               | 설명                                          |
| ---------------------------------- | --------------------------------------------- |
| `ensureDirectoryExists(path)`      | 지정한 디렉토리가 없으면 재귀적으로 생성      |
| `appendToFile(dir, file, content)` | 파일에 로그 추가, 로그 용량 초과 시 자동 정리 |
| `readFile(path)`                   | 파일 내용을 UTF-8로 읽어 문자열 반환          |
| `exists(path)`                     | 해당 경로의 파일 존재 여부를 boolean으로 반환 |

---

### 로깅 유틸 (logger)

-   콘솔 출력 + 파일 저장 지원
-   로그 레벨 필터링 (info / warn / error)
-   ANSI 컬러 지원 (터미널 가독성 강화)

| 메서드              | 설명                                           |
| ------------------- | ---------------------------------------------- |
| `logger.info(msg)`  | 녹색 `[INFO]` 로그 출력                        |
| `logger.warn(msg)`  | 노란색 `[WARN]` 로그 출력                      |
| `logger.error(msg)` | 빨간색 `[ERROR]` 로그 출력 (Error 객체도 지원) |

> 로그 파일은 날짜 기준(`YYYY-MM-DD.log`)으로 저장됩니다.  
> 기본 저장 경로는 `'logs'`이며, `.env` 또는 `logConfig.ts`로 설정 가능합니다.

---

## 예시

```ts
import { logger } from '@jin7942/utils';
import { appendToFile, ensureDirectoryExists } from '@jin7942/utils';

logger.info('작업 시작');
await ensureDirectoryExists('./data');
await appendToFile('./data', 'log.txt', '첫 번째 로그입니다');
```

---

## ⚙ 환경 변수 (.env 또는 process.env)

| 변수명         | 설명                     | 기본값    |
| -------------- | ------------------------ | --------- |
| `LOG_DIR`      | 로그 저장 디렉터리       | `logs`    |
| `LOG_MAX_SIZE` | 최대 디렉터리 용량(byte) | `5242880` |
| `LOG_LEVEL`    | 출력 로그 레벨           | `info`    |

---

## 라이선스

MIT

---

## 제작자

-   [jin7942 GitHub](https://github.com/jin7942)
-   이 유틸은 [RAY 자동배포 도구](https://github.com/jin7942/ray)에서 파생되었습니다.
