import { RESTDataSource } from '@apollo/datasource-rest'
import dotenv from 'dotenv'
import Track from './server/schema/typeDef'

dotenv.config();

const ARCCLOUD_API_KEY = process.env.ARCCLOUD_API_KEY;

interface ApiResponse {
  data: Track[]
}

interface Track {
  name: string
  artist_name: string
  duration_ms: number
  release_date: string
  isrc: string
  internal_id: string
  created_at: string
  updated_at: string
  album: Album
  artists: Artist[]
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

  async getTrack(name: string, artist_name: string): Promise<Track> {
    const query = `?query=${encodeURIComponent(name)}&artists=${encodeURIComponent(artist_name)}`;
    const data: ApiResponse = await this.get(query, {
      headers: {
        'Authorization': `Bearer ${ARCCLOUD_API_KEY}`,
      },
    });
    if (data.data.length > 0) {
      const firstTrack = data.data[0];
      return {
        name: firstTrack.name,
        artist_name: firstTrack.artists.map(artist => artist.name).join(', '),
        duration_ms: firstTrack.duration_ms,
        release_date: firstTrack.album.release_date,
        isrc: firstTrack.isrc,
        internal_id: '',
        created_at: '',
        updated_at: '',
        album: {name: '', release_date: ''},
        artists: [],
      };
    } else {
      throw new Error('Track not found');
    }
  }
}

export default TracksAPI;
