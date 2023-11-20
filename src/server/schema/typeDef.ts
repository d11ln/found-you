const typeDefs = `#graphql
  # This is our base type
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
  # The User type defines the structure for a user in our system
  type User {
    id: ID!
    token: String!
  }
  # The TracksAPI type defines the structure for the tracksAPI in our system
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
    # The createTrack mutation returns a Track type
    createTrack(
        internal_id: ID
        created_at: String
        name: String!
        artist_name: String!
        duration: Int
        ISRC: String
        release_date: String
    ): Track
    # The updateTrack mutation returns a Track type
    updateTrack(
        internal_id: ID
        updated_at: String
        name: String
        artist_name: String
        duration: Int
        ISRC: String
        release_date: String
    ): Track
    # The deleteTrack mutation returns a String type
    deleteTrack(internal_id: ID!): String
  }
`;

export default typeDefs
