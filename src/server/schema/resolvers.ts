import { GraphQLError } from 'graphql';

interface Track {
  name: string;
  artist_name: string;
  duration: number;
  ISRC: string;
  release_date: string;
  created_at: string;
  updated_at: string;
  internal_id: string;
}

interface TracksAPI {
  getTrack(name: string, artist_name: string): Promise<Track>
}

interface DataSources {
  dataSources: {
    tracksAPI: TracksAPI
  } 
}

let mockDB: Map<string, Track> = new Map();

const generateId = () => Math.random().toString(36).substring(2, 11);
const getCurrentTimestamp = () => new Date().toISOString();


const resolvers = {
  Query: {
    getTrackByName: async (_: void, { name, artist_name }: Record<string, string>, { dataSources }: DataSources): Promise<Track | undefined> => {
      const track: Track | undefined = Array.from(mockDB.values()).find(t => t.name === name && t.artist_name === artist_name);
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
    getAllTracks: async (): Promise<Track[]> => {
      return Array.from(mockDB.values());
    },
    getTrackById: async (_: void, { id }: { id: string }): Promise<Track | undefined> => {
      const track: Track | undefined = mockDB.get(id);
      if (!track) {
        throw new Error('Track not found');
      }
      return track;
    },
  },
  Mutation: {
    createTrack: async (_: void, { name, artist_name }: Record<string, string>, { dataSources }: DataSources): Promise<Track> => {
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
    updateTrack: async (_: void, { internal_id, created_at, ...updates }: Track, { dataSources }: any): Promise<Track> => {
      const trackToUpdate = mockDB.get(internal_id);
      if (!trackToUpdate) {
        throw new GraphQLError('Track not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      let updatedTrackData: Track | undefined;
      try {
        updatedTrackData = await dataSources.tracksAPI.getTrack(updates.name, updates.artist_name);
      } catch (error) {
        throw new Error('Failed to update track');
      }
      const updatedTrack: Track = {
        ...trackToUpdate,
        ...updatedTrackData,
        ...updates,
        created_at: trackToUpdate.created_at, // Keep the original created_at
        updated_at: getCurrentTimestamp(), // Update the timestamp
      };
      mockDB.set(internal_id, updatedTrack);
      return updatedTrack;
    },
    deleteTrack: async (_: void, { internal_id }: { internal_id: string }): Promise<string> => {
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