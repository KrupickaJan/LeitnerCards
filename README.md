# Leitner Cards Web App Backend

Welcome to the Leitner Cards Web App backend, a personal project created for study purposes. This project is built using Java Spring Boot and employs the Leitner system to help users efficiently memorize information through spaced repetition.

## Overview

The Leitner system organizes flashcards into multiple levels or boxes. Correctly answered cards move to a higher level, where they are reviewed less frequently, while incorrectly answered cards return to the first level for more frequent review. This method enhances long-term retention by focusing more on difficult cards and gradually reducing review of easier ones.

## Features

- User authentication and authorization
- CRUD operations for flashcards
- Spaced repetition algorithm based on the Leitner system
- RESTful APIs for frontend integration
- MySQL database integration

## Technologies Used

- Java 21
- Spring Boot 3.3.1
- Spring Data JPA
- Spring Security
- Spring Web
- Spring Validation
- MySQL
- Lombok
- JSON Web Tokens (JWT)

### Prerequisites

- Java 21 or higher
- Maven
- MySQL

### Demo:



Default Login
To log in to the default account, use the following credentials:

- Email: default@palette.com
- Password: Abcd1234.
- Project Structure
src/main/java: Contains the main application code.
src/main/resources: Contains configuration files.
src/test/java: Contains test cases.CardsBackend