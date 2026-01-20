# AI Smart Store (React + SQLite)

## 📖 프로젝트 개요
이 프로젝트는 **React**와 **Vite**를 기반으로 구축된 모던 웹 전자상거래 애플리케이션입니다. 사용자 인증, 상품 검색, 장바구니 관리, 주문 처리 기능을 제공하며, **SQLite (WASM)** 기술을 활용하여 브라우저 내에서 관계형 데이터베이스를 구동하거나 백엔드 API와 연동하여 동작하도록 설계되었습니다.

## 🛠 기술 스택 및 선정 이유

### 1. Build Tool: **Vite**
- **선정 이유**: 기존 CRA(Create React App) 대비 압도적으로 빠른 개발 서버 구동 속도와 빌드 성능을 제공합니다.
- **활용**: ES Modules 기반의 HMR(Hot Module Replacement)을 통해 쾌적한 개발 경험을 제공하며, `vite.config.ts`에서 API 프록시 설정을 간편하게 관리합니다.

### 2. Frontend Framework: **React** (with TypeScript)
- **선정 이유**: 컴포넌트 기반 아키텍처로 재사용성을 극대화하고, 거대한 생태계와 커뮤니티 지원을 받을 수 있습니다.
- **Language**: **TypeScript**를 도입하여 정적 타입 검사를 수행, 런타임 오류를 줄이고 코드 안정성을 확보했습니다.

### 3. State Management: **React Context API**
- **선정 이유**: 외부 라이브러리(Redux, Recoil 등) 없이 React 내장 기능만으로 전역 상태(Auth, Store, UIConfig)를 효율적으로 관리할 수 있어 프로젝트 복잡도를 낮췄습니다.
- **구성**:
  - `AuthContext`: 사용자 로그인/회원가입 상태 관리
  - `StoreContext`: 상품 목록, 장바구니, 주문 내역 관리
  - `UIConfigContext`: 테마 색상, 배너 표시 등 UI 설정 관리

### 4. Database: **sql.js** (SQLite WASM)
- **선정 이유**: 별도의 설치 과정 없이 브라우저 메모리 상에서 SQL 쿼리를 실행할 수 있어, 데모 애플리케이션이나 오프라인 우선(Offline-First) 기능을 구현하기에 적합합니다.
- **특징**: 데이터 영속성을 위해 `localStorage`에 DB 파일을 바이너리 문자열로 직렬화하여 저장 및 복원합니다.

### 5. Styling: **Tailwind CSS**
- **선정 이유**: 유틸리티 퍼스트(Utility-First) 방식으로 클래스 이름을 고민하지 않고 빠르게 UI를 구성할 수 있으며, 일관된 디자인 시스템을 유지하기 용이합니다.

### 6. Icons: **Lucide React**
- **선정 이유**: 가볍고 모던한 SVG 아이콘 라이브러리로, React 컴포넌트 형태로 쉽게 커스터마이징이 가능합니다.

## 📂 프로젝트 구조
```
/src
├── components/      # Navbar, ProductList 등 재사용 가능한 UI 컴포넌트
├── context/         # 전역 상태 관리 (Auth, Store, UIConfig)
├── pages/           # 페이지 단위 컴포넌트 (Cart, Login, OrderHistory)
├── services/        # API 통신 및 DB 로직 (apiService.ts, db.ts)
└── types.ts         # TypeScript 인터페이스 정의
```

## 🔍 주요 기능 및 로직

### 1. 상품 검색 및 조회
- 사용자가 검색어를 입력하면 백엔드 API(`apiService.ts`)를 통해 쿼리를 전송합니다.
- 서버가 응답하지 않거나 오프라인 환경인 경우를 대비한 로컬 DB(`sql.js`) 연동 로직이 `services/db.ts`에 포함되어 있습니다.

### 2. 장바구니 및 주문 관리
- 로그인한 사용자만 장바구니 이용 및 주문이 가능하도록 `AuthContext`와 연동된 보호된 라우트(Protected Route) 로직이 적용되었습니다.
- 장바구니 수량 변경, 삭제, 주문 생성 등의 액션은 즉각적인 UI 반영과 함께 서버 동기화가 이루어집니다.

### 3. 사용자 맞춤형 UI (UIConfig)
- 로그인 시 백엔드로부터 사용자별 UI 설정(테마 색상, 할인 배너 표시 여부 등)을 받아와 `UIConfigContext`를 통해 앱 전체의 스타일을 동적으로 변경합니다. 이는 A/B 테스트나 개인화 경험 제공을 위한 기반이 됩니다.

## 🚀 실행 방법

### 사전 요구사항
*   Node.js (v18 이상 권장)
*   npm 또는 yarn

### 설치 및 실행
1.  **의존성 설치**:
    ```bash
    npm install
    ```

2.  **개발 서버 실행**:
    ```bash
    npm run dev
    ```
    브라우저에서 `http://localhost:5173`으로 접속합니다.

### 백엔드 서버 연동
이 프로젝트는 `Nodejs-Simple-Store`와 함께 동작하도록 설계되었습니다. 정상적인 기능 수행을 위해 백엔드 서버도 실행해 주세요.
*   `vite.config.ts`의 프록시 설정에 따라 `/api` 요청이 `http://127.0.0.1:3000`으로 전달됩니다.

---
**업데이트**: 2025년 12월 29일