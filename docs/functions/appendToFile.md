[**@jin7942/utils**](../README.md)

***

[@jin7942/utils](../README.md) / appendToFile

# Function: appendToFile()

> **appendToFile**(`dir`, `filename`, `content`): `Promise`\<`void`\>

Defined in: fs/fsHelper.ts:30

파일에 로그 추가 (줄바꿈 포함)
- 자동으로 디렉토리 생성
- 로그 디렉토리 용량 초과 시 오래된 로그 제거

## Parameters

### dir

`string`

로그 디렉토리 경로

### filename

`string`

로그 파일명

### content

`string`

저장할 문자열

## Returns

`Promise`\<`void`\>
