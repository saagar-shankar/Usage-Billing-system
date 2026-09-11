# Usage Billing System

A backend application built with Node.js, Express, and MongoDB that allows vendors to create services and customers to book and use them on a pay-per-use basis.

The idea behind this project is similar to booking a conference room, coworking space, spa session, gaming room, or any resource where billing depends on how long the customer uses the service.

---

## Features

### Authentication & Authorization

* User Registration
* User Login & Logout
* JWT Authentication
* Role-Based Access Control (RBAC)

### Roles

#### Vendor

* Create new services
* Manage their services
* Delete their own services

#### Customer

* View available services
* Book services
* End service usage
* Pay for completed services

#### Admin

* Delete any service in the system

---

## How It Works

### Creating a Service

A vendor can create a service by providing:

* Service Name
* Description
* Capacity
* First Hour Cost
* Additional Hour Cost

Examples:

* Conference Room
* Spa Session
* Coworking Desk
* Private Office

---

### Booking a Service

When a customer books a service:

* The system checks whether the service exists.
* Available capacity is verified.
* Required slots are reserved.
* A booking record is created.

---

### Ending a Service

When the customer finishes using the service:

* End time is recorded.
* Usage duration is calculated.
* Duration is rounded up to the nearest hour.

Examples:

* 1 hour 10 minutes → 2 hours
* 2 hours 15 minutes → 3 hours

The total bill is then calculated using the pricing configured by the vendor.

---

### Payment

After a service is completed:

* The customer can pay the generated bill.
* Payment status is updated.
* Payment timestamp is recorded.

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Bcrypt
* Cookie Parser

---

## Database Design

### User

Stores user information including:

* Name
* Email
* Password
* Role
* Verification Status
* Refresh Token

### Event

Represents a service created by a vendor.

Stores:

* Name
* Description
* Capacity
* Consumed Slots
* First Hour Cost
* Additional Hour Cost
* Vendor Reference

### Booking

Stores information related to service usage.

Includes:

* Customer Reference
* Service Reference
* Slots Booked
* Start Time
* End Time
* Total Cost
* Booking Status
* Payment Status

---

## API Endpoints

### Authentication

| Method | Endpoint  |
| ------ | --------- |
| POST   | /register |
| POST   | /login    |
| POST   | /logout   |

### Services

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /create-events |
| DELETE | /event/:id     |
| GET    | /all-events    |

### Booking & Billing

| Method | Endpoint                   |
| ------ | -------------------------- |
| POST   | /book-events               |
| PATCH  | /services/:serviceName/end |
| PATCH  | /services/:serviceName/pay |

---

## Installation

Clone the repository:

```bash
git clone https://github.com/saagar-shankar/Usage-Billing-system.git
```

Move into the project directory:

```bash
cd Usage-Billing-system
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add your configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Start the application:

```bash
npm start
```

---
