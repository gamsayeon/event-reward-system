# 이벤트 보상 시스템

## 프로젝트 개요

NestJS 기반 마이크로서비스 아키텍처(MSA)로 설계된 **이벤트 보상 시스템**입니다.  
유저는 다양한 이벤트에 참여하고, 조건을 만족하면 보상을 요청할 수 있으며, 관리자 및 감사자는 보상 요청 내역을 조회할 수 있습니다.

---

## 기술 스택

| 항목          | 도구/버전                |
|---------------|---------------------------|
| 언어           | TypeScript               |
| 런타임         | Node.js 18 (고정)         |
| 프레임워크     | NestJS (11.0.7)        |
| 인증 방식      | JWT                      |
| DB            | MongoDB                  |
| 배포/실행 도구 | Docker + docker-compose |
| 개발 환경      | Windows + VSCode         |
| 실행 환경      | Docker (Linux 기반 컨테이너) |

---

## 시스템 구성

서비스는 총 3개의 NestJS 서버로 구성됩니다.

### Gateway Server
- 모든 API 요청의 진입점
- JWT 인증 및 권한(Role) 검증
- API 요청을 해당 서비스로 프록시 라우팅

### Auth Server
- 유저 정보 및 역할 관리 (USER, OPERATOR, AUDITOR, ADMIN)
- 로그인 및 JWT 발급
- 역할별 권한 구분

### Event Server
- 이벤트 생성 및 보상 등록
- 유저 보상 요청 처리 및 검증
- 보상 지급 상태 저장 및 조회

---

## 기능 상세

### Gateway Server
- 모든 클라이언트 요청을 수신하고, 해당 마이크로서비스로 프록시 라우팅 처리합니다.
- JWT 토큰의 유효성을 검사하고, 사용자 역할(Role)에 따라 접근을 제어합니다.

### Auth Server
- 유저 회원가입 및 로그인 기능을 제공합니다.  
- JWT 토큰을 생성하고, 인증 관련 기능을 처리합니다.  
- 유저의 역할(Role)을 등록하고 관리할 수 있습니다.  

####  역할별 권한

| 역할(Role) | 권한 설명                          |
|------------|------------------------------------|
| USER       | 보상 요청 가능                     |
| OPERATOR   | 이벤트 및 보상 등록 가능           |
| AUDITOR    | 보상 요청 이력 조회만 가능         |
| ADMIN      | 모든 기능에 접근 가능              |

### Event Server

1. **이벤트 등록 / 조회 / 수정**
   - 운영자 또는 관리자는 이벤트를 등록, 조회, 수정할 수 있습니다.
   - 이벤트 등록 시 다음 정보를 입력합니다.
     - 이벤트 이름
     - 조건 (예: 로그인 3일 연속, 친구 1명 초대)
     - 시작일, 종료일
     - 상태 (활성, 비활성)
   - 등록된 이벤트는 아래 기능을 제공합니다.
     - 목록 조회: 이벤트 이름, 조건, 기간, 상태 확인
     - 상세 조회: 이벤트 정보 및 연결된 보상 정보 확인
     - 수정: 조건, 기간, 상태 변경 가능

2. **보상 등록 / 수정**
   - 이벤트마다 하나 이상의 보상 정보를 등록할 수 있습니다.
   - 보상 등록 시 다음 정보를 입력합니다.
     - 보상 유형 (포인트, 아이템, 쿠폰)
     - 보상 이름 및 설명
     - 수량
     - 연결된 이벤트 ID
   - 등록된 보상은 수정할 수 있습니다.
     - 수정: 보상 이름, 설명, 수량, 보상 유형 변경 가능

3. **유저 보상 요청**
   - 유저는 이벤트 참여 후 해당 이벤트에 대한 보상을 요청할 수 있습니다.
   - 시스템은 다음을 검증합니다.
     - 유저가 해당 이벤트 조건을 만족하는지 여부
     - 동일 이벤트에 대해 이미 보상을 요청했는지 여부
   - 조건을 만족하고 중복이 아닌 경우 보상이 지급됩니다.
   - 요청 결과는 다음과 같이 기록됩니다.
     - 성공
     - 실패 (조건 불충족 또는 중복 요청)

4. **보상 요청 내역 확인**
   - 유저는 본인의 보상 요청 이력을 확인할 수 있습니다.
     - 요청한 이벤트, 요청 결과, 요청 시간 정보 포함
   - 운영자, 감사자, 관리자는 전체 유저의 요청 내역을 조회할 수 있습니다.
     - 필터링 기능 제공: 이벤트별, 요청 상태별 기준으로 조회 가능

---
<details>
  <summary><h2 style="display: inline; font-weight: bold;"> 시퀀스 다이어그램 보기</h2></summary>

  <br>

  ## Full Sequence  
  ![image](https://github.com/user-attachments/assets/d0bfd6f1-6f16-4850-a6c7-8f86f98197dd)

  <details>
    <summary><h2 style="display: inline; font-weight: bold;">View Detail Sequence</h2></summary>

   ### 유저 등록 시퀀스
   ![image](https://github.com/user-attachments/assets/089cede7-bde7-4c43-9c4c-60a36a9cb415)
   
   ### 로그인 & JWT 발급 시퀀스
   ![image](https://github.com/user-attachments/assets/01a87513-d920-44fe-81c1-0c26db6257c7)

   ### 이벤트 등록 요청
   ![image](https://github.com/user-attachments/assets/92fa9401-a355-4c48-bd4a-95a9fd11603c)


   ### 이벤트 목록 조회 요청
   ![image](https://github.com/user-attachments/assets/5606a020-9644-4450-b717-eaff1dfef5f0)

   ### 이벤트 상세 조회 요청
   ![image](https://github.com/user-attachments/assets/0bc40230-a67e-4d0e-a761-4e124ffd44d3)

   ### 보상 등록 요청
   ![image](https://github.com/user-attachments/assets/06b9728f-f355-42c2-90fe-8a9b95a50244)

   ### 보상 요청
   ![image](https://github.com/user-attachments/assets/c15f61c1-d6ea-41f9-9907-bd0722030e1c)

   ### 보상 요청 이력 조회
   ![image](https://github.com/user-attachments/assets/ccb56a57-64b5-4f38-abc7-7c06cc2eadc6)

  </details>
</details>

<details>
<summary><h2 style="display: inline; font-weight: bold;"> 실행 방법 (Docker Compose)</h2></summary>

  
### 1. Docker 및 Docker Compose 설치 확인
- 먼저 Docker와 Docker Compose가 설치되어 있는지 확인합니다.
~~~bash
docker --version
docker-compose --version
~~~
- 설치가 안 되어 있다면, [Docker 공식 설치 가이드](https://docs.docker.com/get-docker/)를 참고하세요.

---

### 2. Docker Compose 실행
프로젝트 루트(또는 `docker-compose.yml` 파일이 위치한 디렉토리)에서 아래 명령어로 컨테이너를 실행합니다:
~~~bash
docker-compose up -d
~~~
- `-d` 옵션은 백그라운드 실행을 의미합니다.

---

### 3. 실행 중인 컨테이너 상태 확인
아래 명령어로 컨테이너들이 잘 실행 중인지 확인할 수 있습니다:
~~~bash
docker-compose ps
~~~

---

### 4. 로그 확인
특정 서비스 로그를 보고 싶을 때:
~~~bash
docker-compose logs -f <서비스명>
~~~
예시:
~~~bash
docker-compose logs -f auth
~~~

---

### 5. 컨테이너 중지 및 제거
실행 중인 컨테이너를 중지하고 제거하려면:
~~~bash
docker-compose down
~~~

---

### 6. 참고 사항
- MongoDB 데이터는 `mongo-data` 볼륨에 저장되어 영속성을 가집니다.
- 서비스별 포트 매핑 및 네트워크 설정은 `docker-compose.yml` 파일을 참고하세요.

</details>



   
<details>
<summary><h2 style="display: inline; font-weight: bold;"> 프로젝트 진행 중 느낀 점 </h2></summary>

### 1. MSA 적용과 TypeScript/NestJS 생태계 실전 적응 과정
MSA는 AWSKRUG 세션 등을 통해 개념적으로 익숙하다고 생각했지만, 실제로 처음 프로젝트에 적용해보니 서비스 간의 통신, 네트워크 구성, 데이터 흐름 등에서 많은 어려움이 있었습니다.  
게다가 이번 프로젝트는 **TypeScript와 Node.js, 그리고 NestJS 프레임워크를 처음으로 실전에서 다뤄본 경험**이었기 때문에, 언어와 프레임워크의 문법, 아키텍처 패턴, 비동기 처리 방식 등을 익히는 데 많은 시간이 필요했습니다.  
또한 개발 환경도 기존에 익숙한 IntelliJ와 달리 Visual Studio Code를 처음 사용하면서, 확장 플러그인 설치와 설정에도 적응 기간이 필요했습니다.  
그럼에도 불구하고 시행착오를 거치며 프로젝트 구조를 직접 설계하고 개선해나가면서 점차 익숙해졌고, Docker Compose를 활용해 서비스 간 연결을 구성하며 **MSA 구조와 새로운 기술 스택의 장점**을 직접 체감할 수 있었습니다.

---

### 2. ESLint 사용 중 답답함과 개발 시간 지연
코드 품질 관리를 위해 ESLint를 도입했지만, `npm install`로 의존성을 추가한 후에도 Visual Studio Code에서 라이브러리 함수들이 바로 인식되지 않아 오류가 지속되었습니다.  
문제는 IDE를 재시작하면 해결되는 상황이었지만, 당시에는 이 해결 방법을 몰라 ESLint 오류의 원인을 찾느라 많은 시간을 소모하게 되었습니다.  
그로 인해 개발 흐름이 잦은 오류와 시행착오로 끊기며 예상보다 시간이 지연되었고, 개발 초기의 생산성이 크게 떨어졌습니다.  
이후에는 ESLint와 IDE 간의 동기화 문제를 이해하고, 재시작을 통해 문제를 빠르게 해결할 수 있게 되었습니다.

</details>

