import { RESTDataSource } from '@apollo/datasource-rest'
import dotenv from 'dotenv'
import { TracksApiResponse, Track } from './interfaces'

dotenv.config();

const ARCCLOUD_API_KEY = process.env.ARCCLOUD_API_KEY;

class TracksAPI extends RESTDataSource {
  override baseURL = 'https://eu-api-v2.acrcloud.com/api/external-metadata/tracks/';

  async getTrack(name: string, artist_name: string): Promise<Track> {
    const query = `?query=${encodeURIComponent(name)}&artists=${encodeURIComponent(artist_name)}`;
    const data: TracksApiResponse = await this.get(query, {
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
