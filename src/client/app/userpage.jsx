import React from 'react';
import {render} from 'react-dom';
import bms_list from './insane_bms.json';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient();

class UserPage extends React.Component {
  constructor(props){
    super(props);
    var songs = bms_list["songs"].map(function(obj){
      var object = obj;
      object["queue"] = false;
      return object;
    })
    this.state = {
      songs: songs,
      search_term: '',
      level_field: '',
      filtered_songs: songs,
      message: false,
      requests: []
    }
    this.removeAllSongs = this.removeAllSongs.bind(this);
    this.titleFilter = this.titleFilter.bind(this);
    this.levelFilter = this.levelFilter.bind(this);
  }

  songsFilter(search_term, level_field){
    var filtered_songs = this.state.songs.filter(function(obj){
      var index = obj.title.toLowerCase().indexOf(search_term);
      var obj_level = obj.level.toString();
      if(obj_level === "99") obj.level = "???"
      var level_index = obj_level.indexOf(level_field.toString());
      return index !== -1 && level_index !== -1
    })
    this.setState({
      search_term: search_term,
      level_field: level_field,
      filtered_songs: filtered_songs
    })
  }

  levelFilter(event){
    var level_field = event.target.value;
    this.songsFilter(this.state.search_term, level_field)
  }

  titleFilter(event){
    var search_term = event.target.value;
    this.songsFilter(search_term, this.state.level_field)
  }

  componentDidMount(){
    socket.on("name_return", data => {
      console.log("received")
      this.setState({message: data})
    });
    socket.on("request_update", data => {
      var queue = data.queue;
      var queue_list = data.queue.map(id => {
        return this.state.songs[id];
      })
      var updated_song_list = this.state.songs.map(function(obj){
        var object = obj;
        object.queue = false;
        return object;
      })
      console.log(queue);
      queue.map(function(id){
        updated_song_list[id].queue = true;
      })
      this.setState({
        songs: updated_song_list,
        requests: queue_list
      })
    })
  }

  removeAllSongs(){
    socket.emit("clear");
  }

  render () {
    var song_list = (this.state.search_term === '' && this.state.level_field === '' ? this.state.songs : this.state.filtered_songs);
    var song_rendered = song_list.map(function(song){
      return(
        <SongList song={song} key={song["id"]} />
      )
    })
    var current_song_requests = this.state.requests.map(function(song){
      var level = (song.level === 99 ? "???" : song.level)
      return(
        <span key={"request_"+song.id}>
          {song.title + " (★" + level + ")"}&ensp;&ensp;
        </span>
      )
    })
    return(
      <div>
        <h5>Current Requests:</h5>
        {current_song_requests}
        <br/>
        <div className="row">
          <div className="col-8">
            <input type="text" className="form-control" placeholder="Search for Songs" onChange={this.titleFilter}></input>
          </div>
          <div className="col-4">
            <input type="text" className="form-control" placeholder="Filter by Level" onChange={this.levelFilter}></input>
          </div>
        </div>
        <br/>
        <table className="table">
          <thead>
            <tr className="d-flex">
              <th scope="col" className="col-5">Song Name</th>
              <th scope="col" className="col-5">Artist</th>
              <th scope="col" className="col-1">Level</th>
              <th scope="col" className="col-1"></th>
            </tr>
          </thead>
          <tbody>
            {song_list.length > 0 ? song_rendered : (
              <tr>
                <td className="no_match" colspan="4">
                  No match. Try different search terms.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

class SongList extends React.Component{
  constructor(props){
    super(props);
    this.sendSongRequest = this.sendSongRequest.bind(this);
  }

  sendSongRequest(){
    console.log("HI")
    socket.emit('song_request', this.props.song.id)
  }

  render(){
    var level = (this.props.song.level === 99 ? "???" : this.props.song.level);
    return(
      <tr className={this.props.song.queue ? "disabled d-flex" : "enabled d-flex"}>
        <td className="col-5">{this.props.song.title}</td>
        <td className="col-5">{this.props.song.artist}</td>
        <td className="col-1">{"★" + level}</td>
        <td className="col-1">{this.props.song.queue ? "In Queue" : <button onClick={this.sendSongRequest}>Request</button>}</td>
      </tr>
    )
  }
}

export default UserPage
