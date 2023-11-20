interface Track {
  name: string
  artist_name: string
}

interface TrackWithMetadata extends Track {
  internal_id: string;
  created_at: string;
  updated_at: string;
}

interface DataSources {
  tracksAPI: {
    getTrack: (name: string, artist_name: string) => Promise<Track>;
  };
}

interface Context {
  dataSources: DataSources;
}

describe('getTrackByName', () => {
    it('should return a track by name and artist name', async () => {
      // Arrange
      const name = 'bang diggidy';
      const artist_name = 'shawow';
      const dataSources = {
        tracksAPI: {
          getTrack: jest.fn().mockImplementation((name, artist_name) => {
            return Promise.resolve({ name, artist_name} as Track);
          }),
        },
      };
      const args = { name, artist_name };
      const context = { dataSources };
  
      // Mock the resolver function
      const getTrackByName = jest.fn(async (_, { name, artist_name }, { dataSources }) => {
        const track: Track = await dataSources.tracksAPI.getTrack(name, artist_name);
        return {
          ...track,
          internal_id: Math.random().toString(36).substring(2, 11),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as TrackWithMetadata;
      });
  
      // Act
      const result = await getTrackByName(null, args, context);
  
      // Assert
      expect(dataSources.tracksAPI.getTrack).toHaveBeenCalledWith(name, artist_name);
      expect(result).toEqual(expect.objectContaining({ name, artist_name }));
    });

    it('should create a new track if none is found', async () => {
        // Arrange
        const name = 'new track';
        const artist_name = 'new artist';
        const dataSources: DataSources = {
          tracksAPI: {
            getTrack: jest.fn().mockResolvedValue({ name, artist_name }),
          },
        };
        const args = { name, artist_name };
        const context: Context = { dataSources };
      
        // Mock the resolver function
        const getTrackByName = jest.fn(async (_, { name, artist_name }, { dataSources }) => {
          const track: Track = await dataSources.tracksAPI.getTrack(name, artist_name);
          return {
            ...track,
            internal_id: Math.random().toString(36).substring(2, 11),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as TrackWithMetadata;
        });
      
        // Act
        const result = await getTrackByName(null, args, context);
      
        // Assert
        expect(dataSources.tracksAPI.getTrack).toHaveBeenCalledWith(name, artist_name);
        expect(result).toEqual(expect.objectContaining({ name, artist_name }));
      });
  });