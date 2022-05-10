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