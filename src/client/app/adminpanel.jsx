import React from 'react';
import {render} from 'react-dom';
import bms_list from './insane_bms.json';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('http://localhost:8001')

class AdminPanel extends React.Component {
  constructor(props){
    super(props);
    var songs = bms_list["songs"].map(function(obj){
      var object = obj;
      object["queue"] = false;
      return object;
    })
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
        <button onClick={this.removeAllSongs}>Remove All</button>
        <br/>
        {song_requests}
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
      <div>
        {this.props.song.title}
        {this.props.song.artist}
        {"★"+this.props.song.level}
        <button onClick={this.removeSongFromList}>Remove from List</button>
      </div>
    )
  }
}

export default AdminPanel
