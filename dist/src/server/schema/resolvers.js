import { createNewTrack, deleteTrackFromDatabase, getAllTracksInDatabase, getTrackInDatabaseById, getTrackInDatabaseByName, updateExistingTrack, } from "../../database/database-operations.js";
const resolvers = {
    Query: {
        getTrackByName: async (_, { name, artist_name }, context) => {
            return await getTrackInDatabaseByName(name, artist_name, context);
        },
        getAllTracks: async () => {
            return await getAllTracksInDatabase();
        },
        getTrackById: async (_, { id }) => {
            return await getTrackInDatabaseById(id);
        },
    },
    Mutation: {
        createTrack: async (_, { name, artist_name }, { dataSources }) => {
            return await createNewTrack(name, artist_name, { dataSources });
        },
        updateTrack: async (_, { internal_id, created_at, ...updates }, dataSources) => {
            return await updateExistingTrack(internal_id, updates, dataSources);
        },
        deleteTrack: async (_, { internal_id }) => {
            return await deleteTrackFromDatabase(internal_id);
        },
    },
};
export default resolvers;
