export interface BaseTrack {
  name: string;
  artist_name: string;
}

export interface TracksApiResponse {
  data: Track[];
}

interface Artist {
  name: string;
}

interface Album {
  name: string;
  release_date: string;
}

export interface Track {
  name: string;
  artist_name: string;
  duration_ms: number;
  release_date: string;
  isrc: string;
  internal_id: string;
  created_at: string;
  updated_at: string;
  album: Album;
  artists: Artist[];
}

interface TracksAPI {
  getTrack(name: string, artist_name: string): Promise<Track>;
}

export interface DataSources {
  dataSources: {
    tracksAPI: TracksAPI;
  };
}
