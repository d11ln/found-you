// import { ApolloServer } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';
// import typeDefs from './schema/typeDef';
// import resolvers from './schema/resolvers'
// import TracksAPI from '../tracks-api';
// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });
//   const { url } = await startStandaloneServer(server, {
//       context: async () => {
//           const { cache } = server;
//           return {
//               dataSources: {
//               tracksAPI: new TracksAPI({ cache }),
//               },
//           };
//        },
//       });
//   console.log(`🚀 Server listening at: ${url}`);
