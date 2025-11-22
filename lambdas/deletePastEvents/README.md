🧹 AWS Lambda — Delete Old Events

Automated Daily Cleanup for FattyPopups

This microservice is an AWS Lambda function that runs daily and automatically deletes events older than 14 days from the FattyPopups database (Supabase).
It is triggered by an EventBridge schedule rule (rate(1 day)) and runs completely independently of the main backend and frontend services.