# found you

## Description

This project is a GraphQL server implemented with Apollo Server and TypeScript. It provides a set of resolvers to interact with a mock database.

Basically, a graphql api for finding cool tunes 🥁

## Features

- GraphQL schema and resolvers: The server uses a GraphQL schema to define the API and resolvers to handle the API operations.
- Error handling: The server handles errors properly and returns appropriate status codes.
- TypeScript: The server is written in TypeScript for type safety and clear type definitions.
- Code organization: The code is organized following best practices, making it easy to read and maintain.
- Tests: The server includes a set of tests to verify its functionality.

## Installation

To clone and run this application, you'll need Git and Docker installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/d11ln/found-you

# Go into the repository
$ cd found-you

# Build the Docker image
$ docker build -t <image-name> .

# Run the Docker container
$ docker run -p 4000:4000 <image-name>

Testing

To run the tests, you can use the following command:
$ npm test

This will run the tests with Jest.

```

