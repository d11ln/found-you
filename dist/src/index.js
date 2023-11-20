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
const payload = {};
// Generate a token
const token = jwt.sign(payload, JWT_SECRET);
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
                reject(new GraphQLError('Your session has expired, please refresh or enter a new token.', {
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
        const user = await getUser(actualToken);
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
