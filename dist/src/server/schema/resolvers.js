import { GraphQLError } from 'graphql';
let mockDB = [];
const resolvers = {
    Query: {
        getTrackByName: async (_, { name, artist_name }, { dataSources }) => {
            const track = mockDB.find(t => t.name === name && t.artist_name === artist_name);
            // check if track exists in mockDB
            if (!track) {
                const fetchedTrack = await dataSources.tracksAPI.getTrack(name, artist_name);
                const newTrack = {
                    ...fetchedTrack,
                    internal_id: Math.random().toString(36).substring(2, 11),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(), // Current timestamp
                };
                mockDB.push(newTrack); // Add the new track to the mockDB
                return newTrack;
            }
            return track;
        },
        getAllTracks: async () => {
            return Promise.resolve(mockDB);
        },
        getTrackById: async (_, { id }) => {
            const track = mockDB.find(t => t.internal_id === id);
            if (!track) {
                throw new Error('Track not found');
            }
            return track;
        },
    },
    Mutation: {
        createTrack: async (_, { name, artist_name }, { dataSources }) => {
            let existingTrack = mockDB.find(t => t.name === name && t.artist_name === artist_name);
            if (existingTrack) {
                return existingTrack;
            }
            const internal_id = Math.random().toString(36).substring(2, 11); // Generate a random string for internal_id
            const newTrack = await dataSources.tracksAPI.getTrack(name, artist_name);
            const trackWithMetadata = {
                internal_id,
                ...newTrack,
                created_at: newTrack.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(), // Current timestamp
            };
            mockDB.push(trackWithMetadata);
            existingTrack = trackWithMetadata;
            return existingTrack;
        },
        updateTrack: async (_, { internal_id, created_at, ...updates }, { dataSources }) => {
            const index = mockDB.findIndex(t => t.internal_id === internal_id);
            if (index === -1) {
                throw new GraphQLError('Track not found', {
                    extensions: {
                        code: 'NOT_FOUND',
                    },
                });
            }
            let updatedTrackData;
            try {
                updatedTrackData = await dataSources.tracksAPI.getTrack(updates.name, updates.artist_name);
            }
            catch (error) {
                throw new Error('Failed to update track');
            }
            const updatedTrack = {
                ...mockDB[index],
                ...updatedTrackData,
                ...updates,
                created_at: mockDB[index].created_at,
                updated_at: new Date().toISOString(), // Update the timestamp
            };
            mockDB = [...mockDB.slice(0, index), updatedTrack, ...mockDB.slice(index + 1)];
            return updatedTrack;
        },
        deleteTrack: async (_, { internal_id }) => {
            const index = mockDB.findIndex(t => t.internal_id === internal_id);
            if (index === -1) {
                throw new GraphQLError('Track not found', {
                    extensions: {
                        code: 'NOT_FOUND',
                    },
                });
            }
            mockDB = mockDB.filter(track => track.internal_id !== internal_id);
            return `Track with internal_id ${internal_id} deleted successfully`;
        },
    },
};
export default resolvers;
