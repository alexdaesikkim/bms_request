import React from 'react';
import {render} from 'react-dom';
import bms_list from './insane_bms.json';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('http://localhost:8001')

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
      server_address: "http://localhost:80",
      message: false,
      requests: []
    }
    this.removeAllSongs = this.removeAllSongs.bind(this);
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
    var song_rendered = this.state.songs.map(function(song){
      return(
        <div key={"div" + song["id"]}>
          <SongList song={song} key={song["id"]} />
          <br/>
        </div>
      )
    })
    var current_song_requests = this.state.requests.map(function(song){
      return(
        <div>
          {song.title}
        </div>
      )
    })
    return(
      <div>
        <button onClick={this.removeAllSongs}>Test(Remove)</button>
        <br/>
        {current_song_requests}
        <br/>
        {song_rendered}
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
    return(
      <div>
          {this.props.song.title}
          <br/>
          {this.props.song.artist}
          <br/>
          {"★" + this.props.song.level}
          <br/>
          {this.props.song.queue ? "Requested" : <button onClick={this.sendSongRequest}>Request</button>}
      </div>
    )
  }
}

export default UserPage
