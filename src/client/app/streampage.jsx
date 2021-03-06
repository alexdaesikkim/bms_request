import React from 'react';
import {render} from 'react-dom';
import bms_list from './insane_bms_new.json';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient();

class StreamPage extends React.Component {
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
    })
  }

  render () {
    var string_requests = this.state.requests.map(function(song){
      var song_str = song.title + " (★" + song.level + ")";
      return song_str;
    })
    var song_requests = ""
    var limit = this.state.requests.length > 3 ? 3 : this.state.requests.length;
    var flag = this.state.requests.length > 3 ? true : false;
    for(var x = 0; x < limit; x++){
      if(x === 0){
        song_requests += this.state.requests[0].title + " (★" + this.state.requests[0].level + ")";
      }
      else song_requests += ", " + this.state.requests[x].title + " (★" + this.state.requests[x].level + ")";
    }
    if(flag) song_requests += "..."
    return(
      <div className="queue_view">
        <h5>Current Queue ({this.state.requests.length} song(s)):</h5>
        <div>
          {song_requests}
        </div>
        <br/>
      </div>
    )
  }
}

export default StreamPage
