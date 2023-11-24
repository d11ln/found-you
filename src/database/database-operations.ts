import { GraphQLError } from "graphql";
import { BaseTrack, DataSources, Track } from "../interfaces";

let mockDB: Track[] = [];

// Generate a random string for internal_id
const generateId = (): string => Math.random().toString(36).substring(2, 11);

const findTrack = (name: string, artist_name?: string): Track | undefined => {
  return mockDB.find(
    (t) =>
      t.name.trim().toLowerCase() === name.trim().toLowerCase() &&
      (!artist_name ||
        t.artist_name.trim().toLowerCase() === artist_name.trim().toLowerCase())
  );
};

export const getTrackInDatabaseByName = async (
  name: string,
  artist_name: string,
  context
) => {
  let track = findTrack(name, artist_name);
  if (!track) {
    track = await createNewTrack(name, artist_name, context);
  }
  return track;
};

export const createNewTrack = async (
  name: string,
  artist_name: string,
  { dataSources }: DataSources
) => {
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

export const updateExistingTrack = async (
  internal_id: string,
  updates: BaseTrack,
  { dataSources }: DataSources
) => {
  const index = mockDB.findIndex((t) => t.internal_id === internal_id);
  if (index === -1) {
    throw new GraphQLError("Track not found", {
      extensions: {
        code: "NOT_FOUND",
      },
    });
  }
  let updatedTrackData: Track | undefined;
  try {
    updatedTrackData = await dataSources.tracksAPI.getTrack(
      updates.name,
      updates.artist_name
    );
  } catch (error) {
    throw new Error("Failed to update track");
  }
  const updatedTrack: Track = {
    ...mockDB[index],
    ...updatedTrackData,
    ...updates,
    created_at: mockDB[index].created_at, // Keep the original created_at
    updated_at: new Date().toISOString(), // Update the timestamp
  };
  mockDB = [
    ...mockDB.slice(0, index),
    updatedTrack,
    ...mockDB.slice(index + 1),
  ];
  return updatedTrack;
};

export const deleteTrackFromDatabase = async (internal_id: string) => {
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

export const getTrackInDatabaseById = async (
  internal_id: string
): Promise<Track | undefined> => {
  const track: Track = mockDB.find((t) => t.internal_id === internal_id);
  if (!track) {
    throw new Error("Track not found");
  }
  return track;
};

export const getAllTracksInDatabase = async (): Promise<Track[]> => {
  return Promise.resolve(mockDB);
};
