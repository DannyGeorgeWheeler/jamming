import './App.css';
import { SearchResults } from '../SearchResults/SearchResults';
import { SearchBar } from '../SearchBar/SearchBar';
import { Playlist } from '../Playlist/Playlist';
import React from 'react';
import { Spotify } from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.previewTrack = this.previewTrack.bind(this);
    this.state = { 
      searchResults: [],
      playlistName:  '',
      playlistTracks: [],
      playing: false
    };
    Spotify.getAccessToken();
  }

  addTrack(track) {
    const playlist = this.state.playlistTracks;
    const trackInPlaylist = playlist.find(savedTrack => savedTrack.id === track.id);
    if (trackInPlaylist) {
      return;
    }

    playlist.push(track);
    this.setState({playlistTracks: playlist});
  }

  removeTrack(track) {
    const playlist = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({playlistTracks: playlist});   
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const playlist = this.state.playlistTracks;
    const trackURIs = playlist.map(track => {
      return track.uri;
    })

    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist', playlistTracks: []});
  }

  async search(term) {
    if (term) {
      const results = await Spotify.search(term);
      this.setState({ searchResults: results })  
    }
  }

  previewTrack(track) {
    let preview = this.state.playing;

    if (this.state.playing) {
      this.state.playing.pause();
      preview.src = track.preview;
    } else {
      preview = new Audio(track.preview);
    }
    preview.play();

    this.setState({ playing: preview });
  }

  render() {
    console.log(`rendering: ${this.state.searchResults}`);
    return (
      <div>
        <h1 className='TopTitle'>Ja<span className='highlight'>mmm</span>ing</h1>
        <div className='App'>
          <SearchBar onSearch={this.search}/>
          <div className='App-playlist'>
            <SearchResults 
                searchResults={this.state.searchResults} 
                onAdd={this.addTrack} 
                onPreview={this.previewTrack}
            />
            <Playlist 
                playlistName={this.state.playlistName} 
                playlistTracks={this.state.playlistTracks} 
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}
                onPreview={this.previewTrack}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
