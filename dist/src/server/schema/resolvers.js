import { GraphQLError } from 'graphql';
let mockDB = new Map();
const generateId = () => Math.random().toString(36).substring(2, 11);
const getCurrentTimestamp = () => new Date().toISOString();
const resolvers = {
    Query: {
        getTrackByName: async (_, { name, artist_name }, { dataSources }) => {
            const track = Array.from(mockDB.values()).find(t => t.name === name && t.artist_name === artist_name);
            if (!track) {
                const fetchedTrack = await dataSources.tracksAPI.getTrack(name, artist_name);
                const newTrack = {
                    ...fetchedTrack,
                    internal_id: generateId(),
                    created_at: getCurrentTimestamp(),
                    updated_at: getCurrentTimestamp(),
                };
                mockDB.set(newTrack.internal_id, newTrack);
                return newTrack;
            }
            return track;
        },
        getAllTracks: async () => {
            return Array.from(mockDB.values());
        },
        getTrackById: async (_, { id }) => {
            const track = mockDB.get(id);
            if (!track) {
                throw new Error('Track not found');
            }
            return track;
        },
    },
    Mutation: {
        createTrack: async (_, { name, artist_name }, { dataSources }) => {
            let existingTrack = Array.from(mockDB.values()).find(t => t.name === name && t.artist_name === artist_name);
            if (existingTrack) {
                return existingTrack;
            }
            const internal_id = generateId();
            const newTrack = await dataSources.tracksAPI.getTrack(name, artist_name);
            const trackWithMetadata = {
                internal_id,
                ...newTrack,
                created_at: newTrack.created_at || getCurrentTimestamp(),
                updated_at: getCurrentTimestamp(),
            };
            mockDB.set(internal_id, trackWithMetadata);
            existingTrack = trackWithMetadata;
            return existingTrack;
        },
        updateTrack: async (_, { internal_id, created_at, ...updates }, { dataSources }) => {
            const trackToUpdate = mockDB.get(internal_id);
            if (!trackToUpdate) {
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
                ...trackToUpdate,
                ...updatedTrackData,
                ...updates,
                created_at: trackToUpdate.created_at,
                updated_at: getCurrentTimestamp(), // Update the timestamp
            };
            mockDB.set(internal_id, updatedTrack);
            return updatedTrack;
        },
        deleteTrack: async (_, { internal_id }) => {
            const wasDeleted = mockDB.delete(internal_id);
            if (!wasDeleted) {
                throw new GraphQLError('Track not found', {
                    extensions: {
                        code: 'NOT_FOUND',
                    },
                });
            }
            return `Track with internal_id ${internal_id} deleted successfully`;
        },
    }
};
export default resolvers;
