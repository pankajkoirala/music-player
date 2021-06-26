import React, { useState, useContext } from 'react';
import { AntDesign, Entypo, Feather } from "react-native-vector-icons"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import ProgressCircle from 'react-native-progress-circle'
import TimerPicker from "./../common/timerSelector";
import { AudioContext } from '../context/audioProvider';

import {
  _onPlayPausePressed,
  _onForwardPressed,
  _onBackPressed,
  _trySetRate,
  _onSeekSliderValueChange,
  _onSeekSliderSlidingComplete,
  _getSeekSliderPosition,
  _getTimestamp,
  repateOnOff,
  shuffleOnOff,
  _onVolumeSliderValueChange,
  _onRateSliderSlidingComplete,
  _onStopPressed
} from '../context/audioFunction';


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


import { audioBookPlaylist } from './musicListArray'


const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');


export default ClassMusic = (props) => {
  console.log("🚀 ~ file: newPlaylistFunction.js ~ line 45 ~ props", props)
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const context = useContext(AudioContext);
  const {
    setIndex,
    isBuffering,
    isPlaying,
    LOADING_STRING,
    BUFFERING_STRING,
    index,
    isRepate,
    isShuffle,
    timer,
    setTimer,
    playbackInstance,
    setIsSeeking, setShouldPlayAtEndOfSeek,
    shouldPlayAtEndOfSeek,
    playbackInstancePosition,
    playbackInstanceDuration,
    setIsRepete,
    isSeeking,
    shouldPlay,
    setIsShuffle,
    //function is commited below
    // setVolume,
    // volume,
    // isMute,
    // setIsMute,
    // rate
  } = context



  return (
    <ScrollView bounces={false} >
      <View style={styles.contanier}>
        {/* <TouchableOpacity
          onPress={() => setIsTimerOpen(true)}
          style={
            Platform.OS === "ios" ? styles.genderPickerIOS : styles.genderPicker
          }
        >
          {Platform.OS === "ios" && (
            <View>
              <Text>{timer / 60000} Min</Text>
            </View>
          )}
          <TimerPicker
            setTimerOpen={setIsTimerOpen}
            timerOpen={isTimerOpen}
            onChange={setTimer}
            // oldValue={timer}
            editable={false}
          />
        </TouchableOpacity> */}
        <View style={styles.mainbar}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} >
            <AntDesign name="left" size={24} />
          </TouchableOpacity>
          <Text style={styles.now_playing_text}> Now Playing </Text>
          <Entypo name="dots-three-horizontal" size={24} />
        </View>

        <View style={styles.music_logo_view}>
          <ProgressCircle
            percent={(_getTimestamp(playbackInstance, playbackInstancePosition, playbackInstanceDuration).runningPosition / _getTimestamp(playbackInstance, playbackInstancePosition, playbackInstanceDuration).totalDuration) * 100}
            radius={100}
            borderWidth={10}
            color="#e75480"
            shadowColor="#FFF"
            bgColor="#fff">

            <Image source={{ uri: audioBookPlaylist[index].imageSource }} style={styles.image_view} />
          </ProgressCircle>
        </View>

        <View style={styles.name_of_song_View} >
          <Text style={styles.name_of_song_Text1}>{audioBookPlaylist[index] && audioBookPlaylist[index].title}</Text>
          <Text style={styles.name_of_song_Text2}>{audioBookPlaylist[index] && audioBookPlaylist[index].author} - {audioBookPlaylist[index] && audioBookPlaylist[index].source}</Text>
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
            shuffleOnOff(isShuffle, setIsShuffle)
          }>
            {isShuffle ? <Entypo name="shuffle" size={24} color="#e75480" /> :
              <Entypo name="shuffle" size={24} color="grey" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => _onBackPressed(playbackInstance, isShuffle, audioBookPlaylist, index, setIndex)} style={{}}>
            <FontAwesome5Icon name="backward" size={24} color="#e75480" />
          </TouchableOpacity>
          <View style={{}}>

            <TouchableOpacity style={{ height: 60, width: 60, backgroundColor: '#e75480', justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}
              onPress={() => _onPlayPausePressed(playbackInstance, isPlaying)}
            >
              {isPlaying ? (
                <FontAwesome5Icon name="pause" size={20} color="white" />
              ) : (
                <FontAwesome5Icon name="play" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => _onForwardPressed(playbackInstance, isShuffle, audioBookPlaylist, index, setIndex)} style={{}}>
            <FontAwesome5Icon name="forward" size={24} color="#e75480" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => repateOnOff(isRepate, setIsRepete)} style={{ opacity: 1 }}>
            {isRepate ? <Feather name="repeat" size={20} color="#e75480" /> :
              <Feather name="repeat" size={20} color="grey" />}
          </TouchableOpacity>
        </View>

        <View style={styles.slider_view}>
          <Text style={styles.slider_time}> {_getTimestamp().musicPlayingTime || '00:00'}</Text>
          <Slider
            style={styles.slider_style}
            onSlidingComplete={(e) => _onSeekSliderSlidingComplete(e, playbackInstance, setIsSeeking, shouldPlayAtEndOfSeek, playbackInstanceDuration)}
            onValueChange={(e) => _onSeekSliderValueChange(playbackInstance, isSeeking, setIsSeeking, setShouldPlayAtEndOfSeek, shouldPlay)}
            value={_getSeekSliderPosition(playbackInstance, playbackInstancePosition, playbackInstanceDuration)}
            minimumTrackTintColor="#e75480"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#e75480"
          />
          <Text style={styles.slider_time}>{_getTimestamp().totalMusicTime || '00:00'}</Text>
        </View>

        {/* // it include volume change mute-unmute and rate of speed of playing UI
        <View style={styles.slider_view_volume}>
          <FontAwesome5Icon name='volume-off' size={35} style={styles.slider_time} />
          <Slider
            style={styles.slider_style}
            minimumValue={0}
            maximumValue={1}
            onValueChange={(e) => { _onVolumeSliderValueChange(e, playbackInstance), setVolume(e.toFixed(2)) }}
            minimumTrackTintColor="#e75480"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#e75480"
            value={volume}
          />
          <FontAwesome5Icon name='volume-up' size={25} style={styles.slider_time} />
          <View style={{ width: '25%', alignItems: 'center' }} >
            {isMute ?
              <FontAwesome5Icon onPress={(e) => { (isMute ? _onVolumeSliderValueChange(volume, playbackInstance) : _onVolumeSliderValueChange(0, playbackInstance)), setIsMute(!isMute) }} name='volume-mute' size={30} color='grey' /> :
              <FontAwesome5Icon onPress={(e) => { (isMute ? _onVolumeSliderValueChange(volume, playbackInstance) : _onVolumeSliderValueChange(0, playbackInstance)), setIsMute(!isMute) }} name='volume-up' size={30} color='#e75480' />
            }
          </View>
        </View>
        <View style={styles.slider_view_volume}>
          <FontAwesome5Icon name='fast-backward' size={25} style={styles.slider_time} />
          <Slider
            style={styles.slider_style}
            value={rate / 3.0}
            onSlidingComplete={(e) => _onRateSliderSlidingComplete(e, playbackInstance)}
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
                onPress={() => _onStopPressed(playbackInstance)}
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
