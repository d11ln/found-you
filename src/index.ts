import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { BaseTrack } from "./interfaces.js"; // I tried compiling without the .js extension but get an error file not found - leaving extension in until i figure out why
import resolvers from "./server/schema/resolvers.js";
import typeDefs from "./server/schema/typeDef.js";
import TracksAPI from "./tracks-api.js";

// Define a mockDB
const mockDB = [];
const JWT_SECRET = process.env.JWT_SECRET;

// Uncomment to generate a token for use in the Authorization header for testing purposes
// const payload = {};
// const token = jwt.sign(payload, JWT_SECRET);
// console.log(`use this for your Authorization: Bearer ${token}`);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function getUser(token: string) {
  if (!token) {
    throw new GraphQLError("No token provided", {
      extensions: {
        code: "UNAUTHORIZED",
      },
    });
  }

  return new Promise<BaseTrack>((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err: Error, decoded) => {
      if (err) {
        reject(
          new GraphQLError("Invalid token, please try again.", {
            extensions: {
              code: "UNAUTHORIZED",
            },
          })
        );
      } else {
        resolve(decoded);
      }
    });
  });
}

startStandaloneServer(server, {
  context: async ({ req }) => {
    const { cache } = server;
    const token = req.headers.authorization || "";
    // Remove "Bearer " from token
    const actualToken = token.replace("Bearer ", "");
    const user = await getUser(actualToken).catch((error: Error) => {
      throw new GraphQLError("Failed to authenticate: " + error, {
        extensions: {
          code: "UNAUTHORIZED",
        },
      });
    });
    return {
      user,
      mockDB,
      dataSources: {
        tracksAPI: new TracksAPI({ cache }),
      },
    };
  },
}).then(({ url }) => {
  console.log(`🔊 tuning in at ${url}`);
});
