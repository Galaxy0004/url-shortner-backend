# URL Shortener Backend

A robust and scalable backend service for the URL Shortener project, providing RESTful APIs for shortening URLs, redirecting, tracking analytics, and admin management.

## Overview

This backend service is designed to handle a high volume of requests, providing a fast and reliable experience for users. It utilizes a MongoDB database for persistent storage, ensuring data integrity and scalability.

## Features

### Core Functionality

* Shorten any valid URL to a unique short code
* Redirect short codes to original URLs
* Track number of clicks for each short URL

### Security and Authentication

* Admin authentication and protected endpoints
* JWT-like token authentication (via secret key)
* Secure environment variable management

### Development and Deployment

* Built with Node.js and Express.js
* Utilizes MongoDB (Mongoose) for database interactions
* Supports CORS for frontend integration
* Designed for easy deployment to platforms like Render, Heroku, etc.

## Project Structure

```
url_shortner_be/
├── models/
│   └── url.model.js
├── .env           # Environment variables (never commit this!)
├── .gitignore     # Ignores .env, node_modules, etc.
├── index.js       # Main server file
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the backend directory with the following:

```
MONGO_URI=your_mongo_connection_string
PORT=5000
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
SECRET_KEY=your_secret_key
```

## Running Locally

```bash
npm install
npm run dev   # for development (nodemon)
# or
npm start     # for production
```

## API Endpoints

### Shortening and Redirecting

* `POST   /api/shorten`      — Shorten a URL
* `GET    /:short_code`      — Redirect to original URL

### Admin Management

* `POST   /api/login`        — Admin login (returns token)
* `GET    /api/urls`         — Get all URLs (admin, token required)

## Deployment

This backend service is designed for easy deployment to platforms like Render, Heroku, etc. CORS is set up for the deployed frontend.

## Frontend

See the frontend repo and live app:
[Live URL Shortener App](https://url-shortener-frontend-liard-one.vercel.app/)

---

