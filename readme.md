# ChatGBC

A web-based chatroom application for George Brown College featuring both private messaging and group-based chat rooms.

## Features

- Real-time chat functionality
- Group chat rooms for different topics
- Private messaging between users
- User authentication
- Message history

## Prerequisites

- Node.js 
- MongoDB (Make sure MongoDB server is running locally)

## Run Locally

Clone the project:

```bash
git clone https://github.com/IanM21/101419262_lab_test1_chat_app
```

Navigate to the project directory:

```bash
cd 101419262_lab_test1_chat_app
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run start
```

Access the application:

```
http://localhost:3000/
```

## API Reference

### Create New User

```http
POST /api/signup
```

| Parameter   | Type     | Description                |
| :--------   | :------- | :------------------------- |
| `username`  | `string` | **Required**. Username     |
| `firstname` | `string` | **Required**. First Name   |
| `lastname`  | `string` | **Required**. Last Name    |
| `password`  | `string` | **Required**. Password     |

### User Login

```http
POST /api/login
```

| Parameter  | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username`| `string` | **Required**. Username     |
| `password`| `string` | **Required**. Password     |

### Get Chat History

```http
GET /api/messages/:room
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `room`    | `string` | **Required**. Room name    |

## Available Chat Rooms

- DevOps
- Cloud Computing
- COVID-19
- Sports
- NodeJS

## Environment Variables

The application uses the following default configurations:

- Port: 3000
- MongoDB URL: mongodb://localhost:27017/chat_app
