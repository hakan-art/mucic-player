import React, { useState, useRef } from "react";
//Adding Components
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
//Import Styles
import "./styles/app.scss";
// Import Util
import data from "./data";
import Nav from "./components/Nav";

function App() {
  // Ref
  const audioRef = useRef(null);
  // State
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false)
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    // Calculate Percentage 
    const roundedCurrent = Math.round(current)
    const roundedDuration = Math.round(duration)
    const animationPercentage = Math.round((roundedCurrent / roundedDuration) * 100)

    setSongInfo({ ...songInfo, currentTime: current, duration, animationPercentage });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play()
  }
  return (
    <div className={`App ${libraryStatus ? 'active-App' : ''}`} >
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player
        audioRef={audioRef}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
        currentSong={currentSong}
        setSongInfo={setSongInfo}
        songInfo={songInfo}
        songs={songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <Library songs={songs} setCurrentSong={setCurrentSong} audioRef={audioRef} isPlaying={isPlaying} setSongs={setSongs} libraryStatus={libraryStatus} />
      <audio
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        ref={audioRef}
        src={currentSong.audio}
        onEnded={songEndHandler}
      ></audio>
    </ div>
  );
}

export default App;
