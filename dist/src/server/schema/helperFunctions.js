// // Generate a random string for internal_id
// const generateId = (): string => Math.random().toString(36).substring(2, 11)
// const findTrack = (name: string, artist_name?: string): Track | undefined => {
//   return mockDB.find(t => t.name.trim().toLowerCase() === name.trim().toLowerCase() && (!artist_name || t.artist_name.trim().toLowerCase() === artist_name.trim().toLowerCase()));
// }
// export const findTrackByName = () => {
//     let track = findTrack(name, artist_name);
//     if (!track) {
//       track = await tracksApi(_, { name, artist_name }, context);
//     }
//     return track;
//   },
// export const createTrack() {
// }
