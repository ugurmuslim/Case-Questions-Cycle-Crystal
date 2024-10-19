# Node.js PostgreSQL Docker Project

## Description
This project is a simple Node.js application that connects to a PostgreSQL database. It serves an API for retrieving questions based on the specified country. The application is built with TypeScript and uses Docker for easy setup and deployment.

## Technologies Used
- Node.js
- Express
- PostgreSQL
- TypeScript
- Docker
- Docker Compose


## What I understood from the case

- Every country will have its own cycle and questions. 
- First I thought every country has the same question pool but then I leaned into the idea that every country has their unique problems and cultures so at some point they will have their own questions.

## What I did for the case

Every country have its own cycle period setting in case there would be a need to change the cycle period for a country.

- A cron job runs every day and checks if cycle period has expired for the question.
- If it does it updates the cycle number and question for the country.
- If question cycle is finished it will update the cycle number to 1 and update the question for the country.
- The cycle starting date for every country is 2021-14-10 which is Monday.
- 
## What can be done further

- We can cache the question by redis or another service instead of putting it into object. I did it this way to save time.
- We can put validations for routers and services.
- We can put tests for the application.
- When we deploy it to host services like AWS the app can run in multiple instances. 
- Most probably translations will come into play for the questions. We can add a translation table and get the question based on the language.

## Getting Started

- [Docker](https://docs.docker.com/get-docker/) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.


## RUNNING THE APPLICATION

`
docker-compose up --build`
`

Run below command on root directory to seed the database with some data. 
`
./seedDatabase.sh
`

## API Endpoints

Example Countries = ['US', 'UK', 'Australia', 'Canada','Singapore']

`
GET /api/questions?country=country_name
`

```
{
	"question": {
		"id": 24,
		"question": "Vaco apparatus aggredior explicabo itaque deludo conspergo accommodo quaerat aliqua.",
		"country": "US",
		"cycle_number": 24,
		"createdAt": "2024-10-19T15:16:20.385Z",
		"updatedAt": "2024-10-19T15:16:20.385Z"
	}
}
```