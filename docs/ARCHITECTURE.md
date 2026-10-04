# ChainSiren Architecture

## Overview

ChainSiren is a full-stack cryptocurrency monitoring application.

The system is organized into three main areas:

1. **React.js frontend** — user interface and API consumption
2. **Spring Boot backend** — authentication, business logic, market data, alerts, notifications and integrations
3. **MySQL database** — persistent application data

## High-Level Flow

~~~text
                    +----------------------+
                    |       User           |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |   React.js Frontend  |
                    |  React Router/Axios  |
                    +----------+-----------+
                               |
                         REST / HTTP
                               |
                               v
                    +----------------------+
                    |  Spring Boot Backend |
                    |----------------------|
                    | Authentication       |
                    | User/Profile         |
                    | Crypto/Market        |
                    | Watchlist            |
                    | Alerts               |
                    | Notifications        |
                    | Payments             |
                    +----+---+---+---+-----+
                         |   |   |   |
          +--------------+   |   |   +----------------+
          |                  |   |                    |
          v                  v   v                    v
     +---------+        +------+ +--------+      +---------+
     |  MySQL  |        |CoinGecko| |Twilio|      |Razorpay |
     +---------+        +------+ +--------+      +---------+
                              |
                              v
                       Market data source
~~~

## Backend

The backend is a Spring Boot REST application.

### Main responsibilities

- Authenticate and authorize users
- Manage user profiles and preferences
- Fetch cryptocurrency market data
- Manage watchlists
- Create and evaluate price alerts
- Process notification workflows
- Integrate with external services
- Persist application data in MySQL

### Important technologies

- Java 21
- Spring Boot 3.4.5
- Spring Web
- Spring Security
- Spring Data JPA / Hibernate
- JWT
- Bean Validation
- Spring Mail
- Spring Cache with Caffeine
- Springdoc OpenAPI
- Maven

## Frontend

The frontend is a React application responsible for:

- Authentication screens
- Market-data views
- Watchlist management
- Alert management
- User/profile flows
- Notification-related UI
- API communication through Axios

## External Integrations

### CoinGecko

Used as the external source for cryptocurrency market data.

### Email

Spring Mail is used for email-based notifications.

### Twilio

Twilio is used for SMS-related notification functionality.

### Razorpay

Razorpay integration is present for the planned premium/payment workflow and is currently a work in progress.

## Data Flow: Price Alerts

A simplified alert flow is:

~~~text
User creates alert
       |
       v
Spring Boot API
       |
       v
Persist alert in MySQL
       |
       v
Scheduled alert processing
       |
       v
Fetch current market data
       |
       v
Evaluate configured threshold
       |
   +---+---+
   |       |
Not met   Met
   |       |
   |       v
   |   Trigger notification
   |       |
   |   +---+----+
   |   |        |
   | Email      SMS
   |
Continue monitoring
~~~

## Security

The application uses Spring Security and JWT-based authentication to protect secured API endpoints.

Sensitive values such as database credentials, email credentials, Twilio credentials and Razorpay secrets should be provided through environment variables rather than committed to source control.

## Design Notes

ChainSiren is intentionally documented as a **Spring Boot REST backend + React frontend application**. It is not presented as a microservices system.

The project demonstrates backend concepts including:

- REST API development
- Authentication and authorization
- JPA/Hibernate persistence
- Scheduled background processing
- Caching
- External API integration
- Notification integrations
- Database-driven application design
