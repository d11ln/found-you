import { RESTDataSource } from '@apollo/datasource-rest';
import dotenv from 'dotenv';
import Track from './server/schema/typeDef';

dotenv.config();

const ARCCLOUD_API_KEY = process.env.ARCCLOUD_API_KEY;

interface ApiResponse {
  data: Track[]
}

interface Track {
  name: string
  duration_ms: number
  track_number: number
  isrc: string
  artists: Artist[]
  album: Album
  type: string
}

interface Artist {
  name: string
}

interface Album {
  name: string
  release_date: string
}

class TracksAPI extends RESTDataSource {
  override baseURL = 'https://eu-api-v2.acrcloud.com/api/external-metadata/tracks/';

  async getTrack(name: string, artist_name: string): Promise<typeof Track> {
    const query = `?query=${encodeURIComponent(name)}&artists=${encodeURIComponent(artist_name)}`;
    const data: ApiResponse = await this.get(query, {
      headers: {
        'Authorization': `Bearer ${ARCCLOUD_API_KEY}`,
      },
    });
    if (data.data.length > 0) {
      const firstTrack = data.data[0];
      // @ts-expect-error -> TODO: Fix this
      return {
        name: data.data.map(track => track.name),
        artist_name: firstTrack.artists.map(artist => artist.name),
        duration: data.data.map(track => track.duration_ms),
        release_date: firstTrack.album.release_date,
        ISRC: firstTrack.isrc
      };
    } else {
      return null; // TODO handle the case where no tracks are found
    }
  }
}

export default TracksAPI;


