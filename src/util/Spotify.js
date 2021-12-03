let token;
const client_id = 'd46af5ec95ba42cdbc68912a6be47712';
const redirect_uri = 'https://jammmify.netlify.app';
const scope = 'playlist-modify-private';

let url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent(client_id);
url += '&scope=' + encodeURIComponent(scope);
url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

export const Spotify = {
    getAccessToken() {
        if (token) {
            return token;
        }

        const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(tokenMatch && expiresInMatch) {
            token = tokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => token = '', expiresIn * 1000);
            window.history.pushState('Token', null, '/');
            return token;
        }

        window.location = url;
    },

    async search(term) {
        let url = 'https://api.spotify.com/v1/search?type=track&q='
        url += term;
        token = this.getAccessToken();

        const options = {
            headers: {Authorization: `Bearer ${token}`}
        }

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                const json = await response.json();
                const tracks = json.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                        preview: track.preview_url
                    }
                })
                return tracks;
            }
        } catch(error) {
            console.log(error);
        }
    },

    async savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs) {
            return;
        }

        token = this.getAccessToken();
        let user;
        let header = {Authorization: `Bearer ${token}`};

        try {
            const response = await fetch('https://api.spotify.com/v1/me', {headers: header});
            if (response.ok) {
                const json = await response.json();
                user = json.id;
            }
        } catch(error) {
            console.log(error);
            return;
        }

        try {
            let options = {
                headers: header,
                method: 'POST',
                body: JSON.stringify({
                    name: playlistName,
                    public: false
                })
            }
            const createPlaylist = await fetch(`https://api.spotify.com/v1/users/${user}/playlists`, options);
            if (createPlaylist.ok) {
                const playlistJson = await createPlaylist.json();
                const playlistID = playlistJson.id;

                options.body = JSON.stringify({uris: trackURIs});
                await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, options);
            }
        } catch(error) {
            console.log(error);
            return;
        }

    }
}