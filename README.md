# ChainSiren 🌊📣
_"Your early warning system in the crypto seas."_

ChainSiren helps you navigate volatile crypto markets by alerting you to significant changes in asset prices, trends, and risks. Designed for precision, it ensures users are always one step ahead of the storm.

---

## ✨ Features
- ✅ Email & SMS notifications
- ✅ User registration & login with JWT-based authentication  
- ✅ Profile management and alert preferences  
- ✅ Live market data from CoinGecko API  
- ✅ Create and manage price alerts  
- ✅ Real-time notifications when thresholds are breached  
- ✅ Personal watchlist for favorite coins  
- ✅ Payment gateway integration (Razorpay - WIP)  
- ✅ Role-based access and secure API endpoints  

---

## 💡 Tech Stack

### Backend (Spring Boot)
- Java 17  
- Spring Boot, Spring Security  
- Hibernate / JPA  
- MySQL  
- ModelMapper  
- JWT Authentication  
- Scheduled Jobs (`@Scheduled`)  

### Frontend (React.js)
- React.js  
- Axios  
- React Router  
- Bootstrap / Tailwind CSS  

---

## 📆 Architecture Overview

React Frontend <--> Spring Boot REST APIs <--> MySQL Database
└--> CoinGecko API (external)


---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js & npm  
- Java 17  
- MySQL Server  
- Maven  

---

### Backend Setup
- bash
- git clone https://github.com/Amol39/chainsiren-backend.git
- cd chainsiren-backend
. /mvnw spring-boot:run
------

### Frontend Setup

- git clone https://github.com/Amol39/chainsiren-frontend.git
- cd chainsiren-frontend
- npm install
- npm start
- ✅ Ensure that API base URLs and database properties are updated in application.properties and React .env as required.

### 📊 Modules

- Auth Module: Registration, login, JWT token handling

- Crypto Module: Fetches and displays real-time crypto data

- Alert Module: Alert creation, editing, deletion

- Notification Module: Stores and displays triggered alerts

- Watchlist Module: User-defined crypto tracking

- Payment Module: (In progress) Razorpay integration for premium features

### 🚀 Future Enhancements

- Google/GitHub social sign-in

- Price charting with historical data

- Advanced filters & search

- Mobile app version

## 🙏 Acknowledgements

- CoinGecko API

- Spring Boot

- React

- Razorpay



