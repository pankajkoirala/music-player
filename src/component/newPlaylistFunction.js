import React, { Component, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
// import Slider from 'react-native-slider';
import Slider from '@react-native-community/slider';

import { Asset, Audio, Font } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import moron5 from './../../assets/Maroon5.mp3'
import believer from './../../assets/believer.mp3'



const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFFFFF';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = 'Loading...';
const BUFFERING_STRING = 'Buffering...';
const RATE_SCALE = 3.0;

export default ClassMusic = () => {
  const [index, setIndex] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false)
  const [playbackInstance, setPlaybackInstance] = useState(null)
  const [playbackInstanceName, setPlaybackInstanceName] = useState(LOADING_STRING)
  const [playbackInstancePosition, setPlaybackInstancePosition] = useState(null)
  const [playbackInstanceDuration, setPlaybackInstanceDuration] = useState(null)
  const [shouldPlay, setShouldPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // const[fontLoaded,setFontLoaded]=useState()
  const [volume, setVolume] = useState(1.0)
  const [rate, setRate] = useState(1.0)
  const [portrait, setPortrait] = useState(null)

  const audioBookPlaylist = [
    {
      title: 'believer',
      author: 'believer-believer',
      source: 'believer',
      uri:
        believer,
      imageSource: 'https://i.ytimg.com/vi/jki2p78ppjQ/maxresdefault.jpg'
    },
    {
      title: 'moron5',
      author: 'adam ',
      source: 'moroon5',
      uri:
        moron5,
      imageSource: 'https://m.media-amazon.com/images/M/MV5BNmNmNGExNDctM2Q3MC00MTU5LTkyYzMtMzMyYmI2MTA3MjU3XkEyXkFqcGdeQXVyNjE0ODc0MDc@._V1_.jpg'
    }
  ]
  useEffect(() => {
    async function apple(params) {

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: true
        })

        loadAudio()
      } catch (e) {
        console.log(e)
      }
    }
    apple()

  }, [index])
  const loadAudio = async () => {

    try {
      const playbackInstance = new Audio.Sound()
      const source =
        audioBookPlaylist[index].uri


      const status = {
        shouldPlay: isPlaying,
        volume: volume
      }

      playbackInstance.setOnPlaybackStatusUpdate((arg) => _onPlaybackStatusUpdate(arg))
      await playbackInstance.loadAsync(source, status, false)

      setPlaybackInstance(playbackInstance)
    } catch (e) {
      console.log(e)
    }
  }



  const _updateScreenForLoading = (isLoading) => {
    if (isLoading) {

      setIsPlaying(false)
      setPlaybackInstanceName(LOADING_STRING)
      setPlaybackInstanceDuration(null)
      setPlaybackInstancePosition(null)
      setIsLoading(true)
    } else {

      setPlaybackInstanceName(PLAYLIST[index].name)
      setPortrait(PLAYLIST[index].image)
      setIsLoading(false)
    }
  }

  const _onPlaybackStatusUpdate = status => {

    if (status.isLoaded) {

      setPlaybackInstancePosition(status.positionMillis)
      setPlaybackInstanceDuration(status.durationMillis)
      setShouldPlay(status.shouldPlay)
      setIsPlaying(status.isPlaying)
      setIsBuffering(status.isBuffering)
      setRate(status.rate)
      setVolume(status.volume)
      if (status.didJustFinish) {
        _updatePlaybackInstanceForIndex(true);

      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };



  const _updatePlaybackInstanceForIndex = async (playing) => {
    _updateScreenForLoading(true);

    _loadNewPlaybackInstance(playing);
  }

  const _onPlayPausePressed = () => {
    if (playbackInstance != null) {
      if (isPlaying) {
        playbackInstance.pauseAsync();
      } else {
        playbackInstance.playAsync();
      }
    }
  };

  const _onStopPressed = () => {
    if (playbackInstance != null) {
      playbackInstance.stopAsync();
    }
  };

  const _onForwardPressed = () => {
    if (playbackInstance) {
      playbackInstance.unloadAsync()
      if (index === audioBookPlaylist.length - 1) {
        setIndex(0)
      } else {
        setIndex(index + 1)
      }
    }

  };

  const _onBackPressed = () => {

    if (playbackInstance) {
      playbackInstance.unloadAsync()
      if (index === 0) {
        setIndex(audioBookPlaylist.length - 1)
      } else {
        setIndex(currentIndex - 1)
      }
    }

  };

  const _onVolumeSliderValueChange = value => {
    if (playbackInstance != null) {
      playbackInstance.setVolumeAsync(value);
    }
  };

  const _trySetRate = async rate => {
    if (playbackInstance != null) {
      try {
        await playbackInstance.setRateAsync(rate);
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  const _onRateSliderSlidingComplete = async value => {
    _trySetRate(value * RATE_SCALE);
  };

  const _onSeekSliderValueChange = value => {
    if (playbackInstance != null && !isSeeking) {
      // this.isSeeking = true;
      // this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      setIsSeeking(true)
      setShouldPlayAtEndOfSeek(shouldPlay)
      playbackInstance.pauseAsync();
    }
  };

  const _onSeekSliderSlidingComplete = async value => {
    if (playbackInstance != null) {
      // this.isSeeking = false;
      setIsSeeking(false)
      const seekPosition = value * playbackInstanceDuration;
      if (shouldPlayAtEndOfSeek) {
        playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  function _getSeekSliderPosition() {
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

  function _getMMSSFromMillis(millis) {
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

  function _getTimestamp() {
    if (
      playbackInstance != null &&
      playbackInstancePosition != null &&
      playbackInstanceDuration != null
    ) {
      return `${_getMMSSFromMillis(
        playbackInstancePosition
      )} / ${_getMMSSFromMillis(
        playbackInstanceDuration
      )}`;
    }
    return '';
  }

  return (
    <View style={styles.container}>
      <View style={styles.portraitContainer}>
        <Image
          style={styles.portrait}
          source={{
            uri: portrait,
          }}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={[styles.text]}>
          {playbackInstanceName}
        </Text>
        <Text style={[styles.text,]}>
          {isBuffering ? (
            BUFFERING_STRING
          ) : (
            _getTimestamp()
          )}
        </Text>
      </View>
      <View
        style={[
          styles.buttonsContainerBase,
          styles.buttonsContainerTopRow,
          {
            opacity: false
              ? DISABLED_OPACITY
              : 1.0,
          },
        ]}
      >
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={() => _onBackPressed()}
          disabled={false}
        >
          <View>
            <MaterialIcons
              name="fast-rewind"
              size={40}
              color="#56D5FA"
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={() => _onPlayPausePressed()}
          disabled={false}
        >
          <View>
            {isPlaying ? (
              <MaterialIcons
                name="pause"
                size={40}
                color="#56D5FA"
              />
            ) : (
              <MaterialIcons
                name="play-arrow"
                size={40}
                color="#56D5FA"
              />
            )}
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={() => _onStopPressed()}
          disabled={false}
        >
          <View>
            <MaterialIcons
              name="stop"
              size={40}
              color="#56D5FA"
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={() => _onForwardPressed()}
          disabled={false}
        >
          <View>
            <MaterialIcons
              name="fast-forward"
              size={40}
              color="#56D5FA"
            />
          </View>
        </TouchableHighlight>
      </View>
      <View
        style={[
          styles.playbackContainer,
          {
            opacity: false
              ? DISABLED_OPACITY
              : 1.0,
          },
        ]}
      >
        {/* <Slider
          style={styles.playbackSlider}
          value={_getSeekSliderPosition()}
          onValueChange={(e) => _onSeekSliderValueChange(e)}
          onSlidingComplete={(e) => _onSeekSliderSlidingComplete(e)}
          thumbTintColor="#000000"
          minimumTrackTintColor="#4CCFF9"
          disabled={false}
        /> */}
        <Slider
          style={styles.playbackSlider}
          onSlidingComplete={(e) => _onSeekSliderSlidingComplete(e)}
          onValueChange={(e) => _onSeekSliderValueChange(e)}
          minimumTrackTintColor="#e75480"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#e75480"
          value={_getSeekSliderPosition()}
        />
      </View>
      <View
        style={[
          styles.buttonsContainerBase,
          styles.buttonsContainerMiddleRow,
        ]}
      >
        <View style={styles.volumeContainer}>
          <View>
            <MaterialIcons
              name="volume-down"
              size={40}
              color="#56D5FA"
            />
          </View>
          <Slider
            style={styles.volumeSlider}
            value={1}
            onValueChange={(e) => _onVolumeSliderValueChange(e)}
            thumbTintColor="#000000"
            minimumTrackTintColor="#4CCFF9"
          />
          <View>
            <MaterialIcons
              name="volume-up"
              size={40}
              color="#56D5FA"
            />
          </View>
        </View>
      </View>
      <View
        style={[
          styles.buttonsContainerBase,
          styles.buttonsContainerBottomRow,
        ]}
      >
        <View>
          <MaterialIcons
            name="call-received"
            size={40}
            color="#56D5FA"
          />
        </View>
        <Slider
          style={styles.rateSlider}
          value={rate / RATE_SCALE}
          onSlidingComplete={(e) => _onRateSliderSlidingComplete(e)}
          thumbTintColor="#000000"
          minimumTrackTintColor="#4CCFF9"
        />
        <View>
          <MaterialIcons
            name="call-made"
            size={40}
            color="#56D5FA"
          />
        </View>
      </View>
    </View>
    //   <SafeAreaView style={styles.contanier}>
    //   <View style={styles.mainbar}>
    //     <AntDesign name="left" size={24} style={{ marginLeft: "5%" }} />
    //     <Text style={styles.now_playing_text}> Now Playing </Text>
    //     <Entypo name="dots-three-horizontal" size={24} style={{ marginLeft: "20%" }} />
    //   </View>

    //   <View style={styles.music_logo_view}>
    //     <Image source={{ uri: audioBookPlaylist[currentIndex].imageSource }} style={styles.image_view} />
    //   </View>

    //   <View style={styles.name_of_song_View} >
    //     <Text style={styles.name_of_song_Text1}>{audioBookPlaylist[currentIndex].title}</Text>
    //     <Text style={styles.name_of_song_Text2}>{audioBookPlaylist[currentIndex].author} - {audioBookPlaylist[currentIndex].source}</Text>
    //   </View>

    //   <View style={styles.slider_view}>
    //     <Text style={styles.slider_time}> 4:10 </Text>

    //        <Slider
    //      style={styles.slider_style}
    //         onSlidingComplete={(e) => _onSeekSliderSlidingComplete(e)}
    //         onValueChange={(e) => _onSeekSliderValueChange(e)}
    //         minimumTrackTintColor="#e75480"
    //         maximumTrackTintColor="#d3d3d3"
    //         thumbTintColor="#e75480"
    //         value={_getSeekSliderPosition()}
    //       />
    //     <Text style={styles.slider_time}>12:02</Text>
    //   </View>

    //   <View style={styles.functions_view}>
    //     <Entypo name="shuffle" size={24} color="#e75480" style={{ marginLeft: "9%" }} />
    //     <TouchableOpacity onPress={() => handlePreviousTrack()} style={{ marginLeft: "12%" }}>
    //       <FontAwesome5Icon name="backward" size={24} color="#e75480" />
    //     </TouchableOpacity>
    //     <TouchableOpacity onPress={() => handlePlayPause()} style={{ marginLeft: "12%" }}>
    //       {isPlaying ? (
    //         <FontAwesome5Icon name="pause" size={30} color="#e75480" />
    //       ) : (
    //         <FontAwesome5Icon name="play" size={30} color="#e75480" />
    //       )}
    //     </TouchableOpacity>
    //     <TouchableOpacity onPress={() => handleNextTrack()} style={{ marginLeft: "12%" }}>
    //       <FontAwesome5Icon name="forward" size={24} color="#e75480" />
    //     </TouchableOpacity>
    //     <Feather name="repeat" size={20} color="#e75480" style={{ marginLeft: "10%" }} />
    //   </View>
    //   <Text>Volume</Text>
    //   <View style={styles.slider_view_volume}>
    //     <FontAwesome5Icon name='volume-off' size={35} style={styles.slider_time} />
    //     <Slider
    //       style={styles.slider_style}
    //       minimumValue={0}
    //       maximumValue={1}
    //       onValueChange={(e) => playbackInstance.setVolumeAsync(e.toFixed(2))}
    //       minimumTrackTintColor="#e75480"
    //       maximumTrackTintColor="#d3d3d3"
    //       thumbTintColor="#e75480"
    //       value={volume}
    //     />
    //     <FontAwesome5Icon name='volume-up' size={35} style={styles.slider_time} />
    //   </View>


    //   <View style={styles.recently_played_view}>
    //     <Text style={styles.recently_played_text}> Recently Played </Text>
    //     <View style={styles.recently_played_list}>
    //       <Image source={require("./../../assets/logo.jpg")} style={styles.recently_played_image} />
    //       <View style={styles.recently_played_list_text}>
    //         <Text style={styles.recently_played_list_text1}> #01 - Start With SEO </Text>
    //         <Text style={styles.recently_played_list_text2}> By Setup Cast - 15: 35 </Text>
    //       </View>
    //       <View>
    //         <ProgressCircle
    //           percent={40}
    //           radius={25}
    //           borderWidth={5}
    //           color="#e75480"
    //           shadowColor="#FFF"
    //           bgColor="#fff">
    //           <AntDesign name="play" size={37} color="#e75480" style={{ marginTop: "4%" }} />
    //         </ProgressCircle>
    //       </View>
    //     </View>
    //   </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
  },
  portraitContainer: {
    marginTop: 80,
  },
  portrait: {
    height: 200,
    width: 200,
  },
  detailsContainer: {
    height: 40,
    marginTop: 40,
    alignItems: 'center',
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  playbackSlider: {
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
  },
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainerTopRow: {
    maxHeight: 40,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerMiddleRow: {
    maxHeight: 40,
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: DEVICE_WIDTH - 40,
    maxWidth: DEVICE_WIDTH - 40,
  },
  volumeSlider: {
    width: DEVICE_WIDTH - 80,
  },
  buttonsContainerBottomRow: {
    alignSelf: 'stretch',
  },
  rateSlider: {
    width: DEVICE_WIDTH - 80,
  },
});
