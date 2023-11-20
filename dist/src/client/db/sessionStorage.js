// src/client/db/sessionStorage.ts
const TRACKS_KEY = 'tracks';
const sessionStorage = window.sessionStorage;
export const initDB = () => {
    if (!sessionStorage.getItem(TRACKS_KEY)) {
        sessionStorage.setItem(TRACKS_KEY, JSON.stringify([]));
    }
};
export const addTrack = (track) => {
    const tracks = JSON.parse(sessionStorage.getItem(TRACKS_KEY) || '[]');
    track.id = tracks.length + 1;
    tracks.push(track);
    sessionStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
    console.log("Track added to the session storage");
};
export const getTrackByName = (name) => {
    return new Promise((resolve) => {
        const tracks = JSON.parse(sessionStorage.getItem(TRACKS_KEY) || '[]');
        const foundTrack = tracks.find((track) => track.name === name);
        resolve(foundTrack);
    });
};
