import { RESTDataSource } from '@apollo/datasource-rest';
import dotenv from 'dotenv';
dotenv.config();
const ARCCLOUD_API_KEY = process.env.ARCCLOUD_API_KEY;
class TracksAPI extends RESTDataSource {
    baseURL = 'https://eu-api-v2.acrcloud.com/api/external-metadata/tracks/';
    async getTrack(name, artist_name) {
        const query = `?query=${encodeURIComponent(name)}&artists=${encodeURIComponent(artist_name)}`;
        const data = await this.get(query, {
            headers: {
                'Authorization': `Bearer ${ARCCLOUD_API_KEY}`,
            },
        });
        if (data.data.length > 0) {
            const firstTrack = data.data[0];
            return {
                name: firstTrack.name,
                artist_name: firstTrack.artists.map(artist => artist.name).join(', '),
                duration: firstTrack.duration,
                release_date: firstTrack.album.release_date,
                ISRC: firstTrack.ISRC,
                internal_id: '',
                created_at: '',
                updated_at: '',
                album: { name: '', release_date: '' },
                artists: [],
            };
        }
        else {
            throw new Error('Track not found');
        }
    }
}
export default TracksAPI;
