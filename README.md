# Beer Expiry Tracker

A reminder application for tracking beer expiry dates in beverage distribution. The app helps track products, their expiry dates, and sends timely reminders before products expire.

## Features

- Track beer products with expiry dates
- Take photos of each product package
- Receive push notifications 45 days before expiry
- Daily reminders for the next 5 business days
- Mobile-friendly interface for iOS (TestFlight compatible)

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.3.0
- Spring Security with JWT authentication
- JPA/Hibernate for database operations
- H2 Database (for development)
- Gradle for build management

### Frontend
- React/Next.js
- React Native for iOS compatibility
- Firebase Cloud Messaging for push notifications

## Setup Guide

### Prerequisites
- JDK 17+
- Node.js 18+
- npm or yarn
- Git

### Backend Setup
1. Clone the repository
2. Navigate to the backend directory
3. Run with Gradle: `./gradlew bootRun`

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install` or `yarn install`
3. Start the development server: `npm run dev` or `yarn dev`

## API Documentation
API documentation is available at `/swagger-ui/index.html` when the backend is running.

## Deployment
Instructions for deploying to production environments will be added soon.

## License
[MIT License](LICENSE)