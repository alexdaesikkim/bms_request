import React from 'react';
import {render} from 'react-dom';
import bms_list from './insane_bms.json';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient();

class AdminPanel extends React.Component {
  constructor(props){
    super(props);
    var song_lists = bms_list["songs"];
    var levels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "99"];
    var songs = [];
    for(var x = 0; x < levels.length; x++){
      var level = levels[x];
      var level_songs = song_lists[level];
      level_songs.map(function(song){
        var object = song;
        songs.push(object);
      })
    }
    this.state = {
      songs: songs,
      server_address: "http://localhost:80",
      message: false,
      requests: []
    }
    this.removeAllSongs = this.removeAllSongs.bind(this);
  }

  componentDidMount(){
    socket.on("request_update", data => {
      var queue = data.queue;
      console.log(queue);
      var queue_list = data.queue.map(id => {
        return this.state.songs[id];
      })
      this.setState({
        requests: queue_list
      })
      console.log("ready")
    })
  }

  removeAllSongs(){
    socket.emit("clear");
  }

  render () {
    var song_requests = this.state.requests.map(function(song){
      return(
        <AdminSongList song={song} key={"admin_"+song.id} />
      )
    })
    return(
      <div>
        {song_requests}
        <br/>
        <button className="btn btn-danger" onClick={this.removeAllSongs}>Remove All</button>
      </div>
    )
  }
}

class AdminSongList extends React.Component{
  constructor(props){
    super(props);
    this.removeSongFromList = this.removeSongFromList.bind(this);
  }

  removeSongFromList(){
    socket.emit('request_remove', this.props.song.id)
  }

  render(){
    return(
      <div className="card">
        <div className="card-body">
          {this.props.song.title}
          <br/>
          {this.props.song.artist}
          <br/>
          {"★"+this.props.song.level}
          <br/>
          <button className="btn btn-secondary" onClick={this.removeSongFromList}>Remove from List</button>
        </div>
      </div>
    )
  }
}

export default AdminPanel
