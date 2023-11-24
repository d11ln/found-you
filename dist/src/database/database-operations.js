import { GraphQLError } from "graphql";
let mockDB = [];
// Generate a random string for internal_id
const generateId = () => Math.random().toString(36).substring(2, 11);
const findTrack = (name, artist_name) => {
    return mockDB.find((t) => t.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        (!artist_name ||
            t.artist_name.trim().toLowerCase() === artist_name.trim().toLowerCase()));
};
export const getTrackInDatabaseByName = async (name, artist_name, context) => {
    let track = findTrack(name, artist_name);
    if (!track) {
        track = await createNewTrack(name, artist_name, context);
    }
    return track;
};
export const createNewTrack = async (name, artist_name, { dataSources }) => {
    let existingTrack = findTrack(name, artist_name);
    if (existingTrack) {
        return existingTrack;
    }
    const newTrack = await dataSources.tracksAPI.getTrack(name, artist_name);
    const trackWithMetadata = {
        ...newTrack,
        internal_id: generateId(),
        created_at: newTrack.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(), // Current timestamp
    };
    mockDB.push(trackWithMetadata);
    existingTrack = trackWithMetadata;
    return existingTrack;
};
export const updateExistingTrack = async (internal_id, updates, { dataSources }) => {
    const index = mockDB.findIndex((t) => t.internal_id === internal_id);
    if (index === -1) {
        throw new GraphQLError("Track not found", {
            extensions: {
                code: "NOT_FOUND",
            },
        });
    }
    let updatedTrackData;
    try {
        updatedTrackData = await dataSources.tracksAPI.getTrack(updates.name, updates.artist_name);
    }
    catch (error) {
        throw new Error("Failed to update track");
    }
    const updatedTrack = {
        ...mockDB[index],
        ...updatedTrackData,
        ...updates,
        created_at: mockDB[index].created_at,
        updated_at: new Date().toISOString(), // Update the timestamp
    };
    mockDB = [
        ...mockDB.slice(0, index),
        updatedTrack,
        ...mockDB.slice(index + 1),
    ];
    return updatedTrack;
};
export const deleteTrackFromDatabase = async (internal_id) => {
    const index = mockDB.findIndex((t) => t.internal_id === internal_id);
    if (index === -1) {
        throw new GraphQLError("Track not found", {
            extensions: {
                code: "NOT_FOUND",
            },
        });
    }
    mockDB = mockDB.filter((track) => track.internal_id !== internal_id);
    return `Track with internal_id ${internal_id} deleted successfully`;
};
export const getTrackInDatabaseById = async (internal_id) => {
    const track = mockDB.find((t) => t.internal_id === internal_id);
    if (!track) {
        throw new Error("Track not found");
    }
    return track;
};
export const getAllTracksInDatabase = async () => {
    return Promise.resolve(mockDB);
};
