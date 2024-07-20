# Question and Answer API

This project is an Express-based REST API for managing questions and answers. Users can create, read, update, delete questions and answers, as well as upvote or downvote them.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Database](#database)
- [License](#license)

## Installation

1. Clone the repository:
    ```bash
    mkdir question-answer-api
    cd question-answer-api
    git clone git@github.com:prechak/Question-and-Answer-API.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up the database:
    - Ensure you have a PostgreSQL server running.
    - Create a database and update the connection details in `utils/db.mjs`.

4. Start the server:
    ```bash
    npm start
    ```

## Usage

The API provides endpoints to manage questions and answers. Below is a list of available endpoints and their usage.

## API Endpoints

### Questions

- **Create a question**
  - `POST /questions`
  - Body: `{ "title": "Question title", "description": "Question description", "category": "Question category" }`
  - Response: `201 Created`

- **Get all questions**
  - `GET /questions?keywords=keyword1 keyword2`
  - Response: `200 OK` with a list of questions matching the keywords

- **Get a question by ID**
  - `GET /questions/:id`
  - Response: `200 OK` with the question details

- **Update a question**
  - `PUT /questions/:id`
  - Body: `{ "title": "Updated title", "description": "Updated description", "category": "Updated category" }`
  - Response: `201 Created`

- **Delete a question**
  - `DELETE /questions/:id`
  - Response: `201 Created`

- **Upvote a question**
  - `POST /questions/:id/upvote`
  - Body: `{ "vote": 1 }`
  - Response: `200 OK`

- **Downvote a question**
  - `POST /questions/:id/downvote`
  - Body: `{ "vote": -1 }`
  - Response: `200 OK`

### Answers

- **Create an answer for a question**
  - `POST /questions/:id/answers`
  - Body: `{ "content": "Answer content" }`
  - Response: `201 Created`

- **Get answers for a question**
  - `GET /questions/:id/answers`
  - Response: `200 OK` with a list of answers

- **Upvote an answer**
  - `POST /answers/:id/upvote`
  - Body: `{ "vote": 1 }`
  - Response: `200 OK`

- **Downvote an answer**
  - `POST /answers/:id/downvote`
  - Body: `{ "vote": -1 }`
  - Response: `200 OK`

## Middleware

- `post.validation.mjs`: Validates the creation of questions.
- `put.validation.mjs`: Validates the update of questions.
- `postanswers.validation.mjs`: Validates the creation of answers.

## Database

The database schema includes two main tables, `questions` and `answers`, with additional tables for votes:

- `questions`: Stores question details.
- `answers`: Stores answer details.
- `question_votes`: Tracks votes for questions.
- `answer_votes`: Tracks votes for answers.

## License

This project is licensed under the MIT License.
