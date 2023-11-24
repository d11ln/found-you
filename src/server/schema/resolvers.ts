import { GraphQLError } from 'graphql'

interface Track {
  name: string;
  artist_name: string;
  duration_ms: number;
  isrc: string;
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

let mockDB: Track[] = [];

// Generate a random string for internal_id
const generateId = (): string => Math.random().toString(36).substring(2, 11)

const findTrack = (name: string, artist_name?: string): Track | undefined => {
  return mockDB.find(t => t.name.trim().toLowerCase() === name.trim().toLowerCase() && (!artist_name || t.artist_name.trim().toLowerCase() === artist_name.trim().toLowerCase()));
}

const resolvers = {
  Query: {
    getTrackByName: async (_: void, { name, artist_name }: Record<string, string>, context: DataSources): Promise<Track | undefined> => {
      let track = findTrack(name, artist_name);
      if (!track) {
        track = await resolvers.Mutation.createTrack(_, { name, artist_name }, context);
      }
      return track;
    },
    getAllTracks: async (): Promise<Track[]> => {
      return Promise.resolve(mockDB);
    },
    getTrackById: async (_: void, { id }: { id: string }): Promise<Track | undefined> => {
      const track: Track = mockDB.find(t => t.internal_id === id);
      if (!track) {
        throw new Error('Track not found');
      }
      return track;
    },
  },
  Mutation: {
    createTrack: async (_: void, { name, artist_name }: Record<string, string>, { dataSources }: DataSources): Promise<Track> => {
      let existingTrack = findTrack(name, artist_name);
      if (existingTrack) {
        return existingTrack;
      }
      const newTrack = await dataSources.tracksAPI.getTrack(name, artist_name);
      const trackWithMetadata = {
        ...newTrack,
        internal_id: generateId(),
        created_at: newTrack.created_at || new Date().toISOString(), // Keep existing created_at if it exists, else set current timestamp
        updated_at: new Date().toISOString(), // Current timestamp
      };
      mockDB.push(trackWithMetadata);
      existingTrack = trackWithMetadata;
      return existingTrack;
    },
    updateTrack: async (_: void, { internal_id, created_at, ...updates }: Track, { dataSources }: DataSources): Promise<Track> => {
      const index = mockDB.findIndex(t => t.internal_id === internal_id);
      if (index === -1) {
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
        ...mockDB[index],
        ...updatedTrackData,
        ...updates,
        created_at: mockDB[index].created_at, // Keep the original created_at
        updated_at: new Date().toISOString(), // Update the timestamp
      };
      mockDB = [...mockDB.slice(0, index), updatedTrack, ...mockDB.slice(index + 1)];
      return updatedTrack;
    },
    deleteTrack: async (_: void, { internal_id }: { internal_id: string }): Promise<string> => {
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

export default resolvers
