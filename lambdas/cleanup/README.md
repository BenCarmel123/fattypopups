AWS Lambda - Cleanup

Runs every 2 days:
- Deletes events older than 2 days from Supabase
- Clears S3 tmp folder

Deploy with `zip -r function.zip index.mjs node_modules/` and set env vars: `AWS_S3_BUCKET_NAME`, `SUPABASE_URL`, `SUPABASE_KEY`. Add EventBridge trigger: `rate(2 days)`.