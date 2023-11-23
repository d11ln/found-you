import { GraphQLError } from 'graphql'

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

let mockDB: Track[] = [];

interface User {
  token: string
}

interface TracksAPI {
  getTrack(name: string, artist_name: string): Promise<Track>
}

interface DataSources {
  dataSources: {
    tracksAPI: TracksAPI
  } 
}

const resolvers = {
  Query: {
    getTrackByName: async (_: void, { name, artist_name }: Record<string, string>, { dataSources }: DataSources): Promise<Track | undefined> => {
      const track: Track = mockDB.find(t => t.name === name && t.artist_name === artist_name);
      // check if track exists in mockDB
      if (!track) {
        const fetchedTrack = await dataSources.tracksAPI.getTrack(name, artist_name);
        const newTrack = {
          ...fetchedTrack,
          internal_id: Math.random().toString(36).substring(2, 11), // Generate a random string for internal_id
          created_at: new Date().toISOString(), // Current timestamp
          updated_at: new Date().toISOString(), // Current timestamp
        };
        mockDB.push(newTrack); // Add the new track to the mockDB
        return newTrack;
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
      let existingTrack = mockDB.find(t => t.name === name && t.artist_name === artist_name);
      if (existingTrack) {
        return existingTrack;
      }
      const internal_id = Math.random().toString(36).substring(2, 11); // Generate a random string for internal_id
      const newTrack = await dataSources.tracksAPI.getTrack(name, artist_name);
      const trackWithMetadata = {
        internal_id,
        ...newTrack,
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
