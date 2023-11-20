// // src/client/db/indexedDB.ts
// let db: IDBDatabase;
// interface Track {
//   id?: number;
//   name: string;
//   artist_name: string;
//   duration?: number;
//   ISRC?: string;
//   release_date?: string;
// }
// export const initDB = (): void => {
//   const request = window.indexedDB.open("TrackDatabase", 1);
//   request.onerror = (event) => {
//     console.error("Database error: ", event);
//   };
//   request.onsuccess = (event: any) => {
//     db = event.target.result;
//   };
//   request.onupgradeneeded = (event: any) => {
//     const db = event.target.result;
//     const objectStore = db.createObjectStore("tracks", { keyPath: "id", autoIncrement: true });
//     objectStore.createIndex("name", "name", { unique: false });
//     objectStore.createIndex("artist_name", "artist_name", { unique: false });
//   };
// };
// export const addTrack = (track: Track): void => {
//   const transaction = db.transaction(["tracks"], "readwrite");
//   const store = transaction.objectStore("tracks");
//   const request = store.add(track);
//   request.onsuccess = () => {
//     console.log("Track added to the database");
//   };
//   request.onerror = (event) => {
//     console.error("Error adding track to the database: ", event);
//   };
// };
// export const getTrackByName = (name: string): Promise<Track | undefined> => {
//   return new Promise((resolve, reject) => {
//     const transaction = db.transaction(["tracks"]);
//     const store = transaction.objectStore("tracks");
//     const index = store.index("name");
//     const request = index.get(name);
//     request.onsuccess = () => {
//       resolve(request.result);
//     };
//     request.onerror = (event) => {
//       reject(event);
//     };
//   });
// };
