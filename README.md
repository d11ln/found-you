# 🎹 found you

## whatami

this project is a GraphQL server implemented with Apollo Server and TypeScript. It provides a set of resolvers to interact with a mock database.

basically, a graphql api for finding cool tunes 🥁

## features

- graphQL schema and resolvers: The server uses a GraphQL schema to define the API and resolvers to handle the API operations.
- error handling: The server handles errors properly and returns appropriate status codes.
- typeScript: The server is written in TypeScript for type safety and clear type definitions.
- code organization: The code is organized following best practices, making it easy to read and maintain.
- tests: The server includes a set of tests to verify its functionality.

## installation

to clone and run this application, you'll need Git and Docker installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/d11ln/found-you

# Go into the repository
$ cd found-you

# Build the Docker image
$ docker build -t <image-name> .

# Run the Docker container
$ docker run -p 4000:4000 <image-name>

testing

to run the tests, you can use the following command:
$ npm test

this will run the tests with Jest. i'd have liked to write more tests, i might still

```

## minor things

- you'll need to copy `.example.env` to `.env` and populate it with:
-- API key for ARCCloud, which you can obtain by signing up for an account,
-- JWT Secret in the format `Bearer very-long-secure-secret-key` (please provide your own)

- you'll also need to generate a JWT for the Authorization value in Apollo Studio, there's some code you can uncomment in `index.ts` to make one - this isn't how i'd do things in the Very Real World but it works for the use case

- head over to `localhost/4000` to play around