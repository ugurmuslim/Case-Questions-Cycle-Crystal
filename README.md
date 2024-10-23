# Node.js PostgreSQL Docker Project

## Description

This project is a simple Node.js application that connects to a PostgreSQL database. It serves an API for retrieving
questions based on the specified country. The application is built with TypeScript and uses Docker for easy setup and
deployment.

## Technologies Used

- Node.js
- Express
- PostgreSQL
- TypeScript
- Docker
- Docker Compose

## What I understood from the case

- Every country will have its own cycle and questions.
- First I thought every country has the same question pool but then I leaned into the idea that every country has their
  unique problems and cultures so at some point they will have their own questions.

## What I did for the case

Every country have its own cycle period setting in case there would be a need to change the cycle period for a country.

- A cron job runs every day and checks if cycle period has expired for the question.
- If it does it updates the cycle number and question for the country.
- If question cycle is finished it will update the cycle number to 1 and update the question for the country.
- The cycle starting date for every country is 2021-14-10 which is Monday.
- When users make request with their country api will return the question in the cycle period

## What can be done further

- We can cache the question by redis or another service instead of putting it into object. I did it this way to save
  time.
- We can put validations for routers and services.
- We can put tests for the application.
- When we deploy it to host services like AWS the app can run in multiple instances.
- Most probably translations will come into play for the questions. We can add a translation table and get the question
  based on the language.

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

## CRYSTAL BALL FEATURE

### SUMMARY

- Females gets one question out of 7 daily and the questions are updated everyday at 00:00.
- Males get all the 7 question at once. They can answer the questions whenever they want.
- Depending on their answers they match.
- After match users can see people who they matched with and decide whether it is a yes or no.

### WHAT MORE MUST BE DONE

. Validations must be added.

- So many edge cases must be handled.
- Probably previous question should be taken into consideration.
- Some constants can be migrated to db
- Depending on the feature's complexity this can work as a microservice
- Tests can be added

Requests can be made to the following endpoints:

Every request must have token header for user authentication. Depending on the user's gender responses vary.

Shared example requests with Har file.  

For test purposes first question dates is added to crystalBallQuestions table. 