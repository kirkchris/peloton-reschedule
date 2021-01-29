# Scheduler

Finds open schedule times via graphql, then attempts to reschedule if a newer appointment is available. Uses twilio to send an alert message as well.

## Setup

### .env
Create a .env file with your AWS credemtoa;s

```
AWS_ACCESS_KEY_ID=key
AWS_SECRET_ACCESS_KEY=key
```


### serverless
Create a new serverless application on their app and uses their command line tools to init this as that app ID and then deploy it to aws lambda.
