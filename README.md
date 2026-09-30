# E-Commerce Microservices Architecture

An end-to-end distributed Microservices application built with **Spring Cloud Eureka Service Registry**, **Spring Cloud API Gateway**, **Product Service**, **Order Service**, **MySQL Databases**, and a modern **React (Vite + React Router + Axios)** frontend.

---

## 🏛️ System Architecture Topology

```
                         React Frontend
                            :5173
                              │
                              │ HTTP/REST
                              ▼
                    API Gateway :8080
                              │
                   ┌──────────┴──────────┐
                   │                     │
                   ▼                     ▼
             Product Service       Order Service
                 :8081                 :8082
                   │                     │
                   ▼                     ▼
              Product DB             Order DB
                MySQL                  MySQL
                   │                     │
                   └──────────┬──────────┘
                              │
                         Eureka Server
                            :8761
```

---

## 📁 Repository Directory Structure

```
ecommerce-microservices/
│
├── backend/
│   ├── eureka-server/           # Netflix Eureka Discovery Server (:8761)
│   ├── api-gateway/             # Spring Cloud Gateway (:8080)
│   ├── product-service/         # Product Catalog Service (:8081) + MySQL
│   ├── order-service/           # Order Processing Service (:8082) + MySQL
│   └── pom.xml                  # Parent Maven POM
│
└── frontend/
    └── ecommerce-react/         # React + Vite Frontend (:5173)
        ├── src/
        │   ├── api/
        │   │   ├── axios.js     # Central Axios instance (:8080 Gateway)
        │   │   ├── productApi.js
        │   │   └── orderApi.js
        │   ├── components/
        │   │   ├── Navbar.jsx
        │   │   ├── ProductCard.jsx
        │   │   └── Loading.jsx
        │   ├── pages/
        │   │   ├── Home.jsx
        │   │   ├── Products.jsx
        │   │   ├── ProductDetails.jsx
        │   │   ├── Orders.jsx
        │   │   └── CreateOrder.jsx
        │   ├── App.jsx
        │   ├── main.jsx
        │   └── index.css
        ├── package.json
        └── vite.config.js
```

---

## ⚡ Service Registry & Port Allocations

| Service | Port | Description | Tech Stack |
| :--- | :--- | :--- | :--- |
| **`eureka-server`** | `:8761` | Service Registry & Discovery Server | Spring Cloud Netflix Eureka |
| **`api-gateway`** | `:8080` | Central API Routing & CORS Filter | Spring Cloud Gateway |
| **`product-service`** | `:8081` | Product Catalog CRUD & S3 Storage | Spring Boot 3, Spring Data JPA, MySQL |
| **`order-service`** | `:8082` | Order Creation & Customer Tracking | Spring Boot 3, Spring Data JPA, MySQL |
| **`ecommerce-react`** | `:5173` | React UI Dashboard | React 18, Vite, React Router v6, Axios |

---

## 🚀 Running the Project

### Option A: Using Docker Compose
Launch all services, MySQL databases, and the React UI simultaneously:

```bash
docker-compose up --build
```

Access Points:
- **React Frontend**: `http://localhost:5173`
- **Eureka Dashboard**: `http://localhost:8761`
- **API Gateway**: `http://localhost:8080`

### Option B: Running Natively

1. **Start Eureka Discovery Server**:
   ```bash
   cd backend/eureka-server && mvn spring-boot:run
   ```
2. **Start API Gateway**:
   ```bash
   cd backend/api-gateway && mvn spring-boot:run
   ```
3. **Start Microservices**:
   ```bash
   cd backend/product-service && mvn spring-boot:run
   cd backend/order-service && mvn spring-boot:run
   ```
4. **Start React Frontend**:
   ```bash
   cd frontend/ecommerce-react
   npm install
   npm run dev
   ```
