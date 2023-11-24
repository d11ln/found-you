import {
  createNewTrack,
  deleteTrackFromDatabase,
  getAllTracksInDatabase,
  getTrackInDatabaseById,
  getTrackInDatabaseByName,
  updateExistingTrack,
} from "../../database/database-operations.js";
import { DataSources, Track } from "../../interfaces.js";

const resolvers = {
  Query: {
    getTrackByName: async (
      _: void,
      { name, artist_name }: Record<string, string>,
      context
    ): Promise<Track> => {
      return await getTrackInDatabaseByName(name, artist_name, context);
    },

    getAllTracks: async (): Promise<Track[]> => {
      return await getAllTracksInDatabase();
    },

    getTrackById: async (_: void, { id }: { id: string }): Promise<Track> => {
      return await getTrackInDatabaseById(id);
    },
  },

  Mutation: {
    createTrack: async (
      _: void,
      { name, artist_name }: Record<string, string>,
      { dataSources }: DataSources
    ): Promise<Track | undefined> => {
      return await createNewTrack(name, artist_name, { dataSources });
    },

    updateTrack: async (
      _: void,
      { internal_id, created_at, ...updates }: Track,
      dataSources: DataSources
    ): Promise<Track> => {
      return await updateExistingTrack(internal_id, updates, dataSources);
    },

    deleteTrack: async (
      _: void,
      { internal_id }: { internal_id: string }
    ): Promise<String> => {
      return await deleteTrackFromDatabase(internal_id);
    },
  },
};

export default resolvers;
