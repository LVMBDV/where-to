# Where To?

![lint and test status](https://github.com/lvmbdv/where-to/actions/workflows/lint-and-test.yml/badge.svg)

A REST service that provides autocomplete suggestions for highly populated cities.

## Endpoints

*TODO use OpenAPI specification instead of these :arrow_down:*

#### Suggestions

```
/suggestions
```

Provides suggestions based on specified parameters.

- `query`: Partial or complete query for a city name, case-insensitive. Required. Cannot be empty.
- `latitude`: Latitude of the origin point of the query, floating point, optional.
- `longitude`: Longitude of the origin point of the query, floating point, optional.
- `radius`: Radius of the search area of the query in kilometers, floating point. Optional.
- `sort`: Sort order of the results, must be either "name" or "distance". Default value is "name".

`latitude`, `longitude` and `radius` must be provided together, if any. If
specified, suggestions will have their `distance` field populated accordingly.

#### Ping (only available while testing)

```
/ping
```

Returns "pong". Used to test rate limiting.

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
