# 🎹 found you

## whatami

this project is a GraphQL server implemented with Apollo Server and TypeScript. it provides a set of resolvers to interact with a mock database and fetches data from an external API.

basically, a graphql api for finding cool tunes 🥁

## features

- *graphQL and apollo server*: the project uses a GraphQL schema to define the API and resolvers to handle the API operations and makes use of apollo server 4.
- *error handling*: where possible i tried to handle errors elegantly but this is something i'd have liked to refine a bit more.
- *typeScript*: the project is written in TypeScript for type safety and clear type definitions.
- *authentication*: authentication is handled with JSON Web Token to ensure only authorised users can query the data.
- *code organization*: the code is mostly organized following best practices, making it easy to read and maintain. there is definitely some refactoring that could be done, for example separating the server logic into its own file.
- *tests*: the project includes the beginnings of a set of tests to verify its functionality - i'd have liked to write more tests and might even do just that when i have some time.

## installation

to clone and run this application, you'll need Git and Docker installed on your computer. from your command line:

```bash
# Clone this repository
$ git clone https://github.com/d11ln/found-you

# Go into the repository
$ cd found-you

# Build the Docker image
$ docker build -t found-you .

# Run the Docker container
$ docker run -p 4000:4000 found-you

testing

to run the tests, you can use the following command:
$ npm test

this will run the tests with Jest. 

```

## minor things

- you'll need to copy `.example.env` to `.env` and populate it with:
    -- API key for ARCCloud, which you can obtain by signing up for an account,
    -- JWT Secret in the format `Bearer very-long-secure-secret-key` (please provide your own)

- you'll also need to generate a JWT for the Authorization value in Apollo Studio, there's some code you can uncomment in `index.ts` to make one - this isn't how i'd do things in the Very Real World but it works for the use case

- head over to `localhost/4000` to play around & please let me know what you think, there is plenty (plenty) of room for improvement but i had a ton of fun making this. 

- my favourite track while building this: [The Arc of Tension, Oliver Koletzki](https://youtu.be/XOoCxv7qWf4?si=XScbYi0I6tfzB-6p)
