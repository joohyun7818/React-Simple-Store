# AI Smart Store (React + SQLite + Gemini)

이 프로젝트는 React, Google Gemini API, 그리고 브라우저 내장 SQLite(WASM)를 사용한 전자상거래 애플리케이션입니다.

## 주요 기능

1.  **AI 상품 검색**: Google Gemini API를 활용하여 사용자의 검색어에 맞는 가상의 상품 목록을 생성합니다.
2.  **로컬 데이터베이스 (SQLite)**: 
    *   `sql.js`를 사용하여 브라우저 메모리에서 관계형 데이터베이스를 구동합니다.
    *   데이터는 `LocalStorage`에 파일 형태로 동기화되어, 브라우저를 새로고침해도 회원 정보, 장바구니, 주문 내역이 유지됩니다.
3.  **회원 기능**:
    *   회원가입 (이메일, 이름, 비밀번호 DB 저장)
    *   로그인/로그아웃 (세션 유지)
4.  **쇼핑 기능**:
    *   장바구니 담기/수량 조절/삭제
    *   주문 하기 및 주문 내역 조회

## 실행 방법

이 프로젝트는 Vite를 기반으로 설정되어 있습니다.

### 1. 필수 요구사항
*   Node.js (v18 이상 권장)
*   npm 또는 yarn

### 2. 설치

프로젝트 루트 경로에서 의존성을 설치합니다.

```bash
npm install
```

### 3. API 키 설정

Google Gemini API 사용을 위해 API 키가 필요합니다. 
터미널에서 환경 변수를 설정하고 실행하거나, `.env` 파일을 생성하여 관리할 수 있습니다.

**방법 A: 터미널에서 설정 (Mac/Linux)**
```bash
export API_KEY="YOUR_GEMINI_API_KEY"
npm run dev
```

**방법 B: 터미널에서 설정 (Windows PowerShell)**
```powershell
$env:API_KEY="YOUR_GEMINI_API_KEY"
npm run dev
```

**방법 C: `.env` 파일 사용**
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요.
```
VITE_API_KEY=YOUR_GEMINI_API_KEY
```
*(참고: Vite 환경에서는 `VITE_` 접두사가 필요하지만, 제공된 `vite.config.ts` 설정을 통해 `process.env.API_KEY`도 사용할 수 있도록 처리되어 있습니다.)*

### 4. 실행

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

## 데이터베이스 호환성 정보

*   이 앱은 `sql.js` 라이브러리를 통해 **WebAssembly (WASM)**를 사용합니다.
*   최신 버전의 Chrome, Firefox, Safari, Edge 브라우저에서 동작합니다.
*   데이터는 브라우저의 `LocalStorage`에 저장되므로, 브라우저 캐시를 비우면 데이터가 초기화됩니다.
