# ChainSiren 🌊

> A full-stack cryptocurrency monitoring platform that helps users track market data, manage watchlists, create price alerts, and receive notifications when configured thresholds are reached.

ChainSiren combines a **Spring Boot REST API** with a **React.js frontend** and **MySQL** database. Market data is sourced from the **CoinGecko API**, while authentication, alert management, notifications, and user preferences are handled by the backend.

## ✨ Key Features

- 🔐 JWT-based user authentication with Spring Security
- 👤 User profile and alert-preference management
- 📈 Cryptocurrency market data through CoinGecko API
- ⭐ Personal watchlists for tracked assets
- 🚨 Create, update, and manage price alerts
- 🔔 Automated alert processing and notification handling
- 📧 Email notifications
- 📱 SMS notifications using Twilio
- 💳 Razorpay payment integration for premium features *(work in progress)*
- 🛡️ Secured REST APIs with role-based access control
- 📚 OpenAPI/Swagger documentation support

## 🏗️ Architecture

~~~mermaid
flowchart LR
    U[User] --> F[React.js Frontend]
    F -->|REST / HTTP| B[Spring Boot Backend]
    B --> DB[(MySQL)]
    B --> C[CoinGecko API]
    B --> E[Email / SMTP]
    B --> S[Twilio SMS]
    B --> R[Razorpay]
~~~

See the detailed architecture documentation in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot 3.4.5
- Spring Web
- Spring Security
- Spring Data JPA / Hibernate
- JWT
- Spring Validation
- Spring Mail
- Spring Cache / Caffeine
- Lombok
- ModelMapper
- Springdoc OpenAPI / Swagger
- Maven

### Frontend
- React 19
- React Router
- Axios
- Material UI
- Bootstrap / Tailwind CSS
- Framer Motion
- React Toastify

### Database & Integrations
- MySQL
- CoinGecko API
- Twilio
- Razorpay

## 📁 Repository Structure

~~~text
ChainSiren/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   ├── test/
│   │   └── ...
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── docs/
│   └── ARCHITECTURE.md
│
└── README.md
~~~

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Java 21
- Node.js and npm
- MySQL 8+
- Git

### 1. Clone the repository

~~~bash
git clone https://github.com/Amol39/ChainSiren.git
cd ChainSiren
~~~

### 2. Configure MySQL

Create a MySQL database named `chainsiren`.

The backend reads database credentials from environment variables:

~~~text
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
~~~

Do not commit real credentials, API keys, or secrets to GitHub.

### 3. Configure external services

The backend can use the following environment variables depending on the features you enable:

~~~text
EMAIL_USERNAME=
EMAIL_PASSWORD=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_VERIFY_SERVICE_SID=

RAZORPAY_KEY=
RAZORPAY_SECRET=
~~~

### 4. Start the backend

From the project root:

~~~bash
cd backend
./mvnw spring-boot:run
~~~

On Windows:

~~~powershell
cd backend
.\mvnw.cmd spring-boot:run
~~~

The backend runs on:

~~~text
http://localhost:8080
~~~

### 5. Start the frontend

Open another terminal:

~~~bash
cd frontend
npm install
npm start
~~~

The frontend runs on:

~~~text
http://localhost:3000
~~~

The React development server is configured to proxy API requests to the backend at port 8080.

## 📚 API Documentation

When the backend is running, Swagger/OpenAPI documentation is available through Springdoc.

Try:

~~~text
http://localhost:8080/swagger-ui/index.html
~~~

## 🧩 Core Modules

| Module | Responsibility |
|---|---|
| Authentication | Registration, login and JWT-based authentication |
| User/Profile | User details and preferences |
| Crypto/Market | Cryptocurrency market data |
| Watchlist | Track selected cryptocurrencies |
| Alerts | Create and manage price-based alerts |
| Notifications | Process and deliver alert notifications |
| Payments | Razorpay integration for premium features |

## 🔒 Security

- JWT-based authentication
- Spring Security protected endpoints
- Role-based authorization
- Credentials and third-party secrets supplied through environment variables
- Validation of incoming API requests

## 🔮 Future Improvements

- Historical price charts and analytics
- Advanced search and filtering
- Social login
- Improved alert rules and notification preferences
- Production-ready payment/subscription workflows
- Containerized deployment
- Automated CI/CD pipeline
- Additional automated tests

## 👨‍💻 Author

**Amol Chavan**

Backend Software Engineer focused on Java, Spring Boot, Microservices, Kafka, Distributed Systems, Payments & Fintech.

- GitHub: https://github.com/Amol39
- LinkedIn: https://www.linkedin.com/in/amol-chavan-36339b213/

## 📄 License

This project is currently a personal portfolio project.
