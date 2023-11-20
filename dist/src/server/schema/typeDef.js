const typeDefs = `#graphql

  type Track {
    internal_id: ID
    created_at: String
    updated_at: String
  }
  # The Track type defines the structure for a track in our system
  extend type Track {
    name: [String]
    artist_name: [String]
    duration: [Int]
    ISRC: String
    release_date: String
  }

  type User {
    id: ID!
    token: String!
  }

  type TracksAPI {
    getTrack(name: String, artist_name: String): Track
  }

  # The Query type defines the read-only operations available
  type Query {
    getTrackByName(name: String, artist_name: String): Track
    getAllTracks: [Track]
    getTrackById(id: ID!): Track
  }

  # The Mutation type defines the write operations available
  type Mutation {
    createTrack(
        internal_id: ID
        created_at: String
        name: String!
        artist_name: String!
        duration: Int
        ISRC: String
        release_date: String
    ): Track

    updateTrack(
        internal_id: ID
        updated_at: String
        name: String
        artist_name: String
        duration: Int
        ISRC: String
        release_date: String
    ): Track
    
    deleteTrack(internal_id: ID!): String
  }
`;
export default typeDefs;
