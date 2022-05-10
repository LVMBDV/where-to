# Where To?

![lint and test status](https://github.com/lvmbdv/where-to/actions/workflows/lint-and-test.yml/badge.svg)

A REST service that provides autocomplete suggestions for highly populated cities.

## Development

```shell
# Install dependencies
npm install

# Build JSON data from the TSV file
npm run build:data

# Run tests
npm test

# Run the server (if you have a mongoDB instance running already)
npm start

# Or start the server and a mongo instance in separate containers
docker compose up
```

## Configuration

You can configure the API server via the following environment variables:

  * `NODE_ENV`: Which environment to run the server in. Should be either `development`, `test` or `production`, by convention.
  * `NODE_HOST`: The hostname to bind the server to. Defaults to `localhost`.
  * `NODE_PORT`: The port to run the server on. Defaults to `3000`.
  * `MONGO_URI`: The URI of the MongoDB instance to use. Defaults to `mongodb://localhost:27017/where-to`.
  * `DISABLE_RATE_LIMIT`: Whether to disable the rate limiter. Defaults to `false`.
  * `RATE_LIMIT`: How many requests per minute a user can make. Defaults to `5`.