import React from 'react';
import {render} from 'react-dom';
import bms_list from './insane_bms.json';

console.log(bms_list["songs"].length);

class App extends React.Component {
  constructor(props){
    super(props);
    var songs = bms_list["songs"].map(function(obj){
      var object = obj;
      object["queue"] = false;
      return object;
    })
    this.state = {
      songs: songs
    }
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
    return(
      <div>
        {song_rendered}
      </div>
    )
  }
}

class SongList extends React.Component{
  render(){
    return(
      <div>
          {this.props.song["title"]}
          <br/>
          {this.props.song["artist"]}
          <br/>
          {"★" + this.props.song["level"]}
          <br/>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));
