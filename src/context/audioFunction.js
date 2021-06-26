export const _advanceIndex = (forward, isShuffle, audioBookPlaylist, index, setIndex) => {
  if (isShuffle) {

    setIndex((Math.floor(Math.random() * (audioBookPlaylist.length - 0 + 1)))) %
      audioBookPlaylist.length;
  } else {
    if (forward) {
      if (index === audioBookPlaylist.length - 1) {
        setIndex(0)
      } else {
        setIndex(index + 1)
      }

    }
  }
}
//---------------------------------------------------------------------------------



export const _onPlayPausePressed = (playbackInstance, isPlaying) => {
  if (playbackInstance != null) {
    if (isPlaying) {
      playbackInstance.pauseAsync();
    } else {
      playbackInstance.playAsync();
    }
  }
};



export const _onForwardPressed = (playbackInstance, isShuffle, audioBookPlaylist, index, setIndex) => {
  if (playbackInstance) {
    // playbackInstance.unloadAsync()
    if (isShuffle) {
      setIndex((Math.floor(Math.random() * (audioBookPlaylist.length - 0 + 1)))) %
        audioBookPlaylist.length;
    } else {

      if (index === audioBookPlaylist.length - 1) {
        setIndex(0)
      } else {
        setIndex(index + 1)
      }
    }
  }


};

export const _onBackPressed = (playbackInstance, isShuffle, audioBookPlaylist, index, setIndex) => {

  if (playbackInstance) {
    // playbackInstance.unloadAsync()
    if (isShuffle) {
      setIndex((Math.floor(Math.random() * (audioBookPlaylist.length - 0 + 1)))) %
        audioBookPlaylist.length;
    } else {

      if (index === 0) {
        setIndex(audioBookPlaylist.length - 1)
      } else {
        setIndex(index - 1)
      }
    }
  }

};

export const _onRateSliderSlidingComplete = async (value, playbackInstance) => {
  _trySetRate(value * 3.0, playbackInstance);
};

export const _trySetRate = async (rate, playbackInstance) => {
  if (playbackInstance != null) {
    try {
      await playbackInstance.setRateAsync(rate);
    } catch (error) {
    }
  }
};


export const _onSeekSliderValueChange = (playbackInstance, isSeeking, setIsSeeking, setShouldPlayAtEndOfSeek, shouldPlay) => {
  if (playbackInstance != null && !isSeeking) {

    setIsSeeking(true)
    setShouldPlayAtEndOfSeek(shouldPlay)
    playbackInstance.pauseAsync();
  }
};

export const _onSeekSliderSlidingComplete = async (value, playbackInstance, setIsSeeking, shouldPlayAtEndOfSeek, playbackInstanceDuration) => {
  if (playbackInstance != null) {
    setIsSeeking(false)
    const seekPosition = value * playbackInstanceDuration;
    if (shouldPlayAtEndOfSeek) {
      playbackInstance.playFromPositionAsync(seekPosition);
    } else {
      playbackInstance.setPositionAsync(seekPosition);
    }
  }
};

export function _getSeekSliderPosition(playbackInstance, playbackInstancePosition, playbackInstanceDuration) {
  if (
    playbackInstance != null &&
    playbackInstancePosition != null &&
    playbackInstanceDuration != null
  ) {
    return (
      playbackInstancePosition /
      playbackInstanceDuration
    );
  }
  return 0;
}

export function _getMMSSFromMillis(millis) {
  const totalSeconds = millis / 1000;
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60);

  const padWithZero = number => {
    const string = number.toString();
    if (number < 10) {
      return '0' + string;
    }
    return string;
  };
  return padWithZero(minutes) + ':' + padWithZero(seconds);
}

export function _getTimestamp(playbackInstance, playbackInstancePosition, playbackInstanceDuration) {
  if (
    playbackInstance != null &&
    playbackInstancePosition != null &&
    playbackInstanceDuration != null
  ) {
    return {
      musicPlayingTime: _getMMSSFromMillis(
        playbackInstancePosition
      ), totalMusicTime: _getMMSSFromMillis(
        playbackInstanceDuration
      ),
      totalDuration: playbackInstanceDuration,
      runningPosition: playbackInstancePosition
    };
  }
  return '';
}

export const shuffleOnOff = (isShuffle, setIsShuffle) => {
  if (isShuffle) {
    setIsShuffle(false)
  } else {
    setIsShuffle(true)
  }
}
export const repateOnOff = (isRepate, setIsRepete) => {
  if (isRepate) {
    setIsRepete(false)
  } else {
    setIsRepete(true)

  }
}




export const _onVolumeSliderValueChange = (value, playbackInstance) => {
  if (playbackInstance != null) {
    playbackInstance.setVolumeAsync(value);
  }
};
export const _onStopPressed = (playbackInstance) => {
  if (playbackInstance != null) {
    playbackInstance.stopAsync();
  }
};