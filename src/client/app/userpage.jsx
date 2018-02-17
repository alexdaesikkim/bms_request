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
        <SongList song={song} key={song["id"]} />
      )
    })
    var current_song_requests = this.state.requests.map(function(song){
      return(
        <span>
          {song.title + " (★" + song.level + ")"}&ensp;&ensp;
        </span>
      )
    })
    return(
      <div>
        <h5>Current Requests:</h5>
        {current_song_requests}
        <br/>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Song Name</th>
              <th scope="col">Artist</th>
              <th scope="col">Level</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {song_rendered}
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
    return(
      <tr className={this.props.song.queue ? "disabled" : "enabled"}>
        <td>{this.props.song.title}</td>
        <td>{this.props.song.artist}</td>
        <td>{"★" + this.props.song.level}</td>
        <td>{this.props.song.queue ? "In Queue" : <button onClick={this.sendSongRequest}>Request</button>}</td>
      </tr>
    )
  }
}

export default UserPage
