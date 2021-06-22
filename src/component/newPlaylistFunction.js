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

import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { audioBookPlaylist } from './musicListArray'


const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFFFFF';
const LOADING_STRING = 'Loading...';
const BUFFERING_STRING = 'Buffering...';
const RATE_SCALE = 3.0;

export default ClassMusic = (props) => {

  const {
    _onPlayPausePressed,
    _onForwardPressed,
    _onBackPressed,
    _trySetRate,
    _onSeekSliderValueChange,
    _onSeekSliderSlidingComplete,
    _getSeekSliderPosition,
    _getTimestamp,
    shuffleOnOff,
    repateOnOff,
    isBuffering,
    isPlaying,
    LOADING_STRING,
    BUFFERING_STRING,
    index,
    RATE_SCALE,
    isRepate,
    isShuffle } = props.musicPlayerFunction

  // const [index, setIndex] = useState(0)
  // const [isSeeking, setIsSeeking] = useState(false)
  // const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false)
  // const [playbackInstance, setPlaybackInstance] = useState(null)
  // const [playbackInstancePosition, setPlaybackInstancePosition] = useState(null)
  // const [playbackInstanceDuration, setPlaybackInstanceDuration] = useState(null)
  // const [shouldPlay, setShouldPlay] = useState(false)
  // const [isPlaying, setIsPlaying] = useState(false)
  // const [isBuffering, setIsBuffering] = useState(false)
  // const [volume, setVolume] = useState(1.0)
  // const [rate, setRate] = useState(1.0)
  // const [isShuffle, setIsShuffle] = useState(false)
  // const [isRepate, setIsRepete] = useState(false)
  // const [playAgain, setPlayAgain] = useState(false)
  // //const [isMute, setIsMute] = useState(false) // dont remove it function is comment below

  // useEffect(() => {
  //   if (props?.route?.params?.musicIndex) {
  //     setIndex(props.route.params.musicIndex)
  //     setShouldPlay(true)
  //   }
  // }, [props?.route?.params?.musicIndex])

  // useEffect(() => {
  //   async function apple(params) {

  //     try {
  //       await Audio.setAudioModeAsync({
  //         allowsRecordingIOS: false,
  //         interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  //         playsInSilentModeIOS: true,
  //         interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  //         shouldDuckAndroid: true,
  //         staysActiveInBackground: true,
  //         playThroughEarpieceAndroid: true

  //       })

  //       _loadNewPlaybackInstance(shouldPlay)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   apple()

  // }, [index, playAgain, isRepate, isShuffle,])


  // const _loadNewPlaybackInstance = async (playing) => {
  //   if (playbackInstance != null) {
  //     await playbackInstance.unloadAsync();
  //     playbackInstance.setOnPlaybackStatusUpdate(null);
  //     setPlaybackInstance(null)
  //     // playbackInstance = null;
  //   }

  //   const source = audioBookPlaylist[index].uri

  //   const initialStatus = {
  //     shouldPlay: playing,
  //     rate: rate,
  //     volume: volume,
  //   };

  //   const { sound, status } = await Audio.Sound.createAsync(
  //     source,
  //     initialStatus,
  //     (arg) => _onPlaybackStatusUpdate(arg)
  //   );
  //   setPlaybackInstance(sound)
  // }


  // const _onPlaybackStatusUpdate = status => {
  //   if (status.isLoaded) {
  //     setPlaybackInstancePosition(status.positionMillis)
  //     setPlaybackInstanceDuration(status.durationMillis)
  //     setShouldPlay(status.shouldPlay)
  //     setIsPlaying(status.isPlaying)
  //     setIsBuffering(status.isBuffering)
  //     setRate(status.rate)
  //     if (status.didJustFinish) {
  //       if (isRepate === true) {
  //         setShouldPlay(true)
  //         setPlayAgain(!playAgain)
  //       } else {
  //         setShouldPlay(true)
  //         _advanceIndex(true);
  //       }
  //     }
  //   } else {
  //     if (status.error) {
  //       console.log(`FATAL PLAYER ERROR: ${status.error}`);
  //     }
  //   }
  // };







  // const _advanceIndex = (forward) => {
  //   if (isShuffle) {

  //     setIndex((Math.floor(Math.random() * (audioBookPlaylist.length - 0 + 1)))) %
  //       audioBookPlaylist.length;
  //   } else {
  //     if (forward) {
  //       if (index === audioBookPlaylist.length - 1) {
  //         setIndex(0)
  //       } else {
  //         setIndex(index + 1)
  //       }

  //     }
  //   }
  // }
  // //---------------------------------------------------------------------------------



  // const _onPlayPausePressed = () => {
  //   if (playbackInstance != null) {
  //     if (isPlaying) {
  //       playbackInstance.pauseAsync();
  //     } else {
  //       playbackInstance.playAsync();
  //     }
  //   }
  // };



  // const _onForwardPressed = () => {
  //   if (playbackInstance) {
  //     playbackInstance.unloadAsync()
  //     if (isShuffle) {
  //       setIndex((Math.floor(Math.random() * (audioBookPlaylist.length - 0 + 1)))) %
  //         audioBookPlaylist.length;
  //     } else {

  //       if (index === audioBookPlaylist.length - 1) {
  //         setIndex(0)
  //       } else {
  //         setIndex(index + 1)
  //       }
  //     }
  //   }


  // };

  // const _onBackPressed = () => {

  //   if (playbackInstance) {
  //     playbackInstance.unloadAsync()
  //     if (isShuffle) {
  //       setIndex((Math.floor(Math.random() * (audioBookPlaylist.length - 0 + 1)))) %
  //         audioBookPlaylist.length;
  //     } else {

  //       if (index === 0) {
  //         setIndex(audioBookPlaylist.length - 1)
  //       } else {
  //         setIndex(index - 1)
  //       }
  //     }
  //   }

  // };


  // const _trySetRate = async rate => {
  //   if (playbackInstance != null) {
  //     try {
  //       await playbackInstance.setRateAsync(rate);
  //     } catch (error) {
  //     }
  //   }
  // };


  // const _onSeekSliderValueChange = value => {
  //   if (playbackInstance != null && !isSeeking) {

  //     setIsSeeking(true)
  //     setShouldPlayAtEndOfSeek(shouldPlay)
  //     playbackInstance.pauseAsync();
  //   }
  // };

  // const _onSeekSliderSlidingComplete = async value => {
  //   if (playbackInstance != null) {
  //     setIsSeeking(false)
  //     const seekPosition = value * playbackInstanceDuration;
  //     if (shouldPlayAtEndOfSeek) {
  //       playbackInstance.playFromPositionAsync(seekPosition);
  //     } else {
  //       playbackInstance.setPositionAsync(seekPosition);
  //     }
  //   }
  // };

  // function _getSeekSliderPosition() {
  //   if (
  //     playbackInstance != null &&
  //     playbackInstancePosition != null &&
  //     playbackInstanceDuration != null
  //   ) {
  //     return (
  //       playbackInstancePosition /
  //       playbackInstanceDuration
  //     );
  //   }
  //   return 0;
  // }

  // function _getMMSSFromMillis(millis) {
  //   const totalSeconds = millis / 1000;
  //   const seconds = Math.floor(totalSeconds % 60);
  //   const minutes = Math.floor(totalSeconds / 60);

  //   const padWithZero = number => {
  //     const string = number.toString();
  //     if (number < 10) {
  //       return '0' + string;
  //     }
  //     return string;
  //   };
  //   return padWithZero(minutes) + ':' + padWithZero(seconds);
  // }

  // function _getTimestamp() {
  //   if (
  //     playbackInstance != null &&
  //     playbackInstancePosition != null &&
  //     playbackInstanceDuration != null
  //   ) {
  //     return {
  //       musicPlayingTime: _getMMSSFromMillis(
  //         playbackInstancePosition
  //       ), totalMusicTime: _getMMSSFromMillis(
  //         playbackInstanceDuration
  //       ),
  //       totalDuration: playbackInstanceDuration,
  //       runningPosition: playbackInstancePosition
  //     };
  //   }
  //   return '';
  // }

  // const shuffleOnOff = () => {
  //   if (isShuffle) {
  //     setIsShuffle(false)
  //   } else {
  //     setIsShuffle(true)

  //   }
  // }
  // const repateOnOff = () => {
  //   if (isRepate) {
  //     setIsRepete(false)
  //   } else {
  //     setIsRepete(true)

  //   }
  // }
  // //comment function is related to stop mute-unmute and rate of speed change

  // // const _onRateSliderSlidingComplete = async value => {
  // //   _trySetRate(value * RATE_SCALE);
  // // };


  // // const _onVolumeSliderValueChange = value => {
  // //   if (playbackInstance != null) {
  // //     playbackInstance.setVolumeAsync(value);
  // //   }
  // // };
  // // const _onStopPressed = () => {
  // //   if (playbackInstance != null) {
  // //     playbackInstance.stopAsync();
  // //   }
  // // };
  return (
    <ScrollView bounces={false} >
      <View style={styles.contanier}>
        <View style={styles.mainbar}>
          <AntDesign name="left" size={24} />
          <Text style={styles.now_playing_text}> Now Playing </Text>
          <Entypo name="dots-three-horizontal" size={24} />
        </View>

        <View style={styles.music_logo_view}>
          <ProgressCircle
            percent={(_getTimestamp().runningPosition / _getTimestamp().totalDuration) * 100}
            radius={100}
            borderWidth={10}
            color="#e75480"
            shadowColor="#FFF"
            bgColor="#fff">

            <Image source={{ uri: audioBookPlaylist[index].imageSource }} style={styles.image_view} />
          </ProgressCircle>
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


        <View style={styles.functions_view}>
          <TouchableOpacity style={{ opacity: 1 }} onPress={() =>
            shuffleOnOff()
          }>
            {isShuffle ? <Entypo name="shuffle" size={24} color="#e75480" /> :
              <Entypo name="shuffle" size={24} color="grey" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _onBackPressed()} style={{}}>
            <FontAwesome5Icon name="backward" size={24} color="#e75480" />
          </TouchableOpacity>
          <View style={{}}>

            <TouchableOpacity style={{ height: 60, width: 60, backgroundColor: '#e75480', justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}
              onPress={() => _onPlayPausePressed()}
            >
              {isPlaying ? (
                <FontAwesome5Icon name="pause" size={20} color="white" />
              ) : (
                <FontAwesome5Icon name="play" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => _onForwardPressed()} style={{}}>
            <FontAwesome5Icon name="forward" size={24} color="#e75480" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => repateOnOff()} style={{ opacity: 1 }}>
            {isRepate ? <Feather name="repeat" size={20} color="#e75480" /> :
              <Feather name="repeat" size={20} color="grey" />}
          </TouchableOpacity>
        </View>

        <View style={styles.slider_view}>
          <Text style={styles.slider_time}> {_getTimestamp().musicPlayingTime || '00:00'}</Text>
          <Slider
            style={styles.slider_style}
            onSlidingComplete={(e) => _onSeekSliderSlidingComplete(e)}
            onValueChange={(e) => _onSeekSliderValueChange(e)}
            value={_getSeekSliderPosition()}
            minimumTrackTintColor="#e75480"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#e75480"
          />
          <Text style={styles.slider_time}>{_getTimestamp().totalMusicTime || '00:00'}</Text>
        </View>
        {/*
        // it include volume change mute-unmute and rate of speed of playing UI
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
          <View style={{ width: '25%', alignItems: 'center' }} >
            {isMute ?
              <FontAwesome5Icon onPress={(e) => { (isMute ? _onVolumeSliderValueChange(volume) : _onVolumeSliderValueChange(0)), setIsMute(!isMute) }} name='volume-mute' size={30} color='grey' /> :
              <FontAwesome5Icon onPress={(e) => { (isMute ? _onVolumeSliderValueChange(volume) : _onVolumeSliderValueChange(0)), setIsMute(!isMute) }} name='volume-up' size={30} color='#e75480' />
            }
          </View>
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
          <View
            style={{ width: '25%', alignItems: 'center' }}

            disabled={false}
          >
            <View>
              <FontAwesome5Icon
                name="stop-circle"
                onPress={() => _onStopPressed()}
                size={35}
                color="#e75480"
              />
            </View>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  contanier: {
    // height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH,
    flex: 1,
    paddingTop: 50
  },
  mainbar: {
    display: 'flex',
    justifyContent: 'space-between',
    height: "10%",
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  now_playing_text: {
    fontSize: 19,

  },
  music_logo_view: {
    height: "70%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,

  },
  image_view: {
    height: "100%",
    width: "100%",
    borderRadius: 10
  },
  name_of_song_View: {
    height: "15%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
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
    flexDirection: "row",
    marginVertical: 25

  },
  slider_view_volume: {
    height: "10%",
    width: "75%",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 4
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
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: "row",
    height: "10%",
    width: "100%",
    alignItems: "center",
    marginVertical: 10
  },
});
