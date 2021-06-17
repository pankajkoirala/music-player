import React, { Component, useEffect, useState } from 'react';
import { AntDesign, Entypo, Feather } from "react-native-vector-icons"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import ProgressCircle from 'react-native-progress-circle'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity, ScrollView
} from 'react-native';
// import Slider from 'react-native-slider';
import Slider from '@react-native-community/slider';

import { Asset, Audio, Font } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { audioBookPlaylist } from './musicListArray'


const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFFFFF';
const LOADING_STRING = 'Loading...';
const BUFFERING_STRING = 'Buffering...';
const RATE_SCALE = 3.0;

export default ClassMusic = (props) => {
  const [index, setIndex] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false)
  const [playbackInstance, setPlaybackInstance] = useState(null)
  const [playbackInstancePosition, setPlaybackInstancePosition] = useState(null)
  const [playbackInstanceDuration, setPlaybackInstanceDuration] = useState(null)
  const [shouldPlay, setShouldPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isMute, setIsMute] = useState(false)
  const [volume, setVolume] = useState(1.0)
  const [rate, setRate] = useState(1.0)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepate, setIsRepete] = useState(false)
  const [playAgain, setPlayAgain] = useState(false)

  useEffect(() => {
    if (props?.route?.params?.musicIndex) {
      setIndex(props.route.params.musicIndex)
      setShouldPlay(true)
    }
  }, [props?.route?.params?.musicIndex])

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

        _loadNewPlaybackInstance(shouldPlay)
      } catch (e) {
        console.log(e)
      }
    }
    apple()

  }, [index, playAgain, isRepate, isShuffle,])


  const _loadNewPlaybackInstance = async (playing) => {
    if (playbackInstance != null) {
      await playbackInstance.unloadAsync();
      playbackInstance.setOnPlaybackStatusUpdate(null);
      setPlaybackInstance(null)
      // playbackInstance = null;
    }

    const source = audioBookPlaylist[index].uri

    const initialStatus = {
      shouldPlay: playing,
      rate: rate,
      volume: volume,
    };

    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      (arg) => _onPlaybackStatusUpdate(arg)
    );
    setPlaybackInstance(sound)
  }


  const _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {

      setPlaybackInstancePosition(status.positionMillis)
      setPlaybackInstanceDuration(status.durationMillis)
      setShouldPlay(status.shouldPlay)
      setIsPlaying(status.isPlaying)
      setIsBuffering(status.isBuffering)
      setRate(status.rate)
      if (status.didJustFinish) {
        if (isRepate === true) {
          setShouldPlay(true)
          setPlayAgain(!playAgain)
        } else {
          setShouldPlay(true)
          _advanceIndex(true);
        }
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };







  const _advanceIndex = (forward) => {
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

  const _onBackPressed = () => {

    if (playbackInstance) {
      playbackInstance.unloadAsync()
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
      }
    }
  };

  const _onRateSliderSlidingComplete = async value => {
    _trySetRate(value * RATE_SCALE);
  };

  const _onSeekSliderValueChange = value => {
    if (playbackInstance != null && !isSeeking) {

      setIsSeeking(true)
      setShouldPlayAtEndOfSeek(shouldPlay)
      playbackInstance.pauseAsync();
    }
  };

  const _onSeekSliderSlidingComplete = async value => {
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

  const shuffleOnOff = () => {
    if (isShuffle) {
      setIsShuffle(false)
    } else {
      setIsShuffle(true)

    }
  }
  const repateOnOff = () => {
    if (isRepate) {
      setIsRepete(false)
    } else {
      setIsRepete(true)

    }
  }
  return (
    <ScrollView bounces={false} >
      <View style={styles.contanier}>
        <View style={styles.mainbar}>
          <AntDesign name="left" size={24} style={{ marginLeft: "5%" }} />
          <Text style={styles.now_playing_text}> Now Playing </Text>
          <Entypo name="dots-three-horizontal" size={24} style={{ marginLeft: "20%" }} />
        </View>

        <View style={styles.music_logo_view}>
          <Image source={{ uri: audioBookPlaylist[index].imageSource }} style={styles.image_view} />
        </View>

        <View style={styles.name_of_song_View} >
          <Text style={styles.name_of_song_Text1}>{audioBookPlaylist[index].title}</Text>
          <Text style={styles.name_of_song_Text2}>{audioBookPlaylist[index].author} - {audioBookPlaylist[index].source}</Text>
          <Text style={[styles.text,]}>
            {isBuffering ? (
              BUFFERING_STRING
            ) : (
              LOADING_STRING
            )}
          </Text>
        </View>

        <View style={styles.slider_view}>
          <Text style={styles.slider_time}> {_getTimestamp().musicPlayingTime || '00:00'}</Text>
          <Slider
            style={styles.slider_style}
            onSlidingComplete={(e) => _onSeekSliderSlidingComplete(e)}
            onValueChange={(e) => _onSeekSliderValueChange(e)}
            minimumTrackTintColor="#e75480"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#e75480"
            value={_getSeekSliderPosition()}
          />
          <Text style={styles.slider_time}>{_getTimestamp().totalMusicTime || '00:00'}</Text>
        </View>
        <View style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}>
          <TouchableHighlight
            style={styles.wrapper}
            onPress={() => _onStopPressed()}
            disabled={false}
          >
            <View>
              <FontAwesome5Icon
                name="stop-circle"
                size={40}
                color="#e75480"
              />
            </View>
          </TouchableHighlight>
          <TouchableOpacity onPress={(e) => { (isMute ? _onVolumeSliderValueChange(volume) : _onVolumeSliderValueChange(0)), setIsMute(!isMute) }}>
            {isMute ?
              <FontAwesome5Icon name='volume-mute' size={30} color='grey' /> :
              <FontAwesome5Icon name='volume-up' size={30} color='#e75480' />
            }
          </TouchableOpacity>
        </View>
        <View style={styles.functions_view}>
          <TouchableOpacity style={{ marginLeft: "9%", opacity: 1 }} onPress={() =>
            shuffleOnOff()
          }>
            {isShuffle ? <Entypo name="shuffle" size={24} color="#e75480" /> :
              <Entypo name="shuffle" size={24} color="grey" />}

          </TouchableOpacity>
          <TouchableOpacity onPress={() => _onBackPressed()} style={{ marginLeft: "12%" }}>
            <FontAwesome5Icon name="backward" size={24} color="#e75480" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _onPlayPausePressed()} style={{ marginLeft: "12%" }}>
            {isPlaying ? (
              <FontAwesome5Icon name="pause" size={30} color="#e75480" />
            ) : (
              <FontAwesome5Icon name="play" size={30} color="#e75480" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _onForwardPressed()} style={{ marginLeft: "12%" }}>
            <FontAwesome5Icon name="forward" size={24} color="#e75480" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => repateOnOff()} style={{ marginLeft: "10%", opacity: 1 }}>
            {isRepate ? <Feather name="repeat" size={20} color="#e75480" /> :
              <Feather name="repeat" size={20} color="grey" />}
          </TouchableOpacity>
        </View>
        <View style={styles.slider_view_volume}>
          <FontAwesome5Icon name='volume-off' size={35} style={styles.slider_time} />
          <Slider
            style={styles.slider_style}
            minimumValue={0}
            maximumValue={1}

            onValueChange={(e) => { _onVolumeSliderValueChange(e), setVolume(e.toFixed(2)) }}
            minimumTrackTintColor="#e75480"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#e75480"

            value={volume}
          />
          <FontAwesome5Icon name='volume-up' size={25} style={styles.slider_time} />
        </View>
        <View style={styles.slider_view_volume}>
          <FontAwesome5Icon name='fast-backward' size={25} style={styles.slider_time} />
          <Slider
            style={styles.slider_style}
            value={rate / RATE_SCALE}
            onSlidingComplete={(e) => _onRateSliderSlidingComplete(e)}
            thumbTintColor="#000000"
            minimumTrackTintColor="#4CCFF9"
          />
          <FontAwesome5Icon name='fast-forward' size={25} style={styles.slider_time} />
        </View>

        <View style={styles.recently_played_view}>
          <Text style={styles.recently_played_text}> Recently Played </Text>
          <View style={styles.recently_played_list}>
            <Image source={require("./../../assets/logo.jpg")} style={styles.recently_played_image} />
            <View style={styles.recently_played_list_text}>
              <Text style={styles.recently_played_list_text1}> #01 - Start With SEO </Text>
              <Text style={styles.recently_played_list_text2}> By Setup Cast - 15: 35 </Text>
            </View>
            <View>
              <ProgressCircle
                percent={(_getTimestamp().runningPosition / _getTimestamp().totalDuration) * 100}
                radius={25}
                borderWidth={5}
                color="#e75480"
                shadowColor="#FFF"
                bgColor="#fff">
                <AntDesign name="play" size={25} color="#e75480" style={{ marginTop: "4%" }} />
              </ProgressCircle>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  contanier: {
    // height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH
  },
  mainbar: {
    height: "10%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  now_playing_text: {
    fontSize: 19,
    marginLeft: "24%"
  },
  music_logo_view: {
    height: "30%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image_view: {
    height: "100%",
    width: "50%",
    borderRadius: 10
  },
  name_of_song_View: {
    height: "15%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  name_of_song_Text1: {
    fontSize: 19,
    fontWeight: "500"
  },
  name_of_song_Text2: {
    color: "#808080",
    marginTop: "4%"
  },
  slider_view: {
    height: "10%",
    width: "100%",
    alignItems: "center",
    flexDirection: "row"
  },
  slider_view_volume: {
    height: "10%",
    width: "100%",
    alignItems: "center",
    flexDirection: "row"
  },
  slider_style: {
    height: "70%",
    width: "60%"
  },
  slider_time: {
    // fontSize: 15,
    marginLeft: "6%",
    color: "#808080"
  },
  functions_view: {
    flexDirection: "row",
    height: "10%",
    width: "100%",
    alignItems: "center"
  },
  recently_played_view: {
    height: "25%",
    width: "100%",
  },
  recently_played_text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#808080",
    marginLeft: "5%",
    marginTop: "6%"
  },
  recently_played_list: {
    backgroundColor: "#FFE3E3",
    height: "50%",
    width: "90%",
    borderRadius: 10,
    marginLeft: "5%",
    marginTop: "5%",
    alignItems: "center",
    flexDirection: "row"
  },
  recently_played_image: {
    height: "80%",
    width: "20%",
    borderRadius: 10
  },
  recently_played_list_text: {
    height: "100%",
    width: "60%",
    justifyContent: "center"
  },
  recently_played_list_text1: {
    fontSize: 15,
    marginLeft: "8%"
  },
  recently_played_list_text2: {
    fontSize: 16,
    color: "#808080",
    marginLeft: "8%"
  }
});
