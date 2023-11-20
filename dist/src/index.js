import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import resolvers from './server/schema/resolvers.js';
import typeDefs from './server/schema/typeDef.js';
import TracksAPI from './tracks-api.js';
// Define a mockDB
const mockDB = [];
const JWT_SECRET = process.env.JWT_SECRET;
// Uncomment to generate a token for use in the Authorization header for testing purposes
// const payload = {}
// const token = jwt.sign(payload, JWT_SECRET);
// console.log(token);
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
async function getUser(token) {
    if (!token) {
        throw new GraphQLError('No token provided', {
            extensions: {
                code: 'UNAUTHORIZED',
            },
        });
    }
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(new GraphQLError('Invalid token, please try again.', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    },
                }));
            }
            else {
                resolve(decoded);
            }
        });
    });
}
startStandaloneServer(server, {
    context: async ({ req }) => {
        const { cache } = server;
        const token = req.headers.authorization || '';
        // Remove "Bearer " from token
        const actualToken = token.replace('Bearer ', '');
        const user = await getUser(actualToken).catch((error) => {
            throw new GraphQLError('Failed to authenticate: ' + error, {
                extensions: {
                    code: 'UNAUTHORIZED',
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
    console.log(`📀 tuning in at ${url}`);
});
