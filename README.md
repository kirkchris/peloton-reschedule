# Scheduler

Finds open schedule times via graphql, then attempts to reschedule if a newer appointment is available. Uses twilio to send an alert message as well.

## Setup

### .env
Fill in credentails into the `starting.env` file and save as a new file: `.env`


### serverless
Create a new serverless application on their app and uses their command line tools to init this as that app ID and then deploy it to aws lambda.
