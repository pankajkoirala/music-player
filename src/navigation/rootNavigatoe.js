import React, { Component, useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import ButtomNavigation from "./buttomNav";
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';




import {
  Dimensions, Alert
} from 'react-native';
import { Audio } from 'expo-av';
import { audioBookPlaylist } from './../component/musicListArray'
//redux
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFFFFF';
const LOADING_STRING = 'Loading...';
const BUFFERING_STRING = 'Buffering...';
const RATE_SCALE = 3.0;
export default function AppStack(props) {
  const [index, setIndex] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false)
  const [playbackInstance, setPlaybackInstance] = useState(null)
  const [playbackInstancePosition, setPlaybackInstancePosition] = useState(null)
  const [playbackInstanceDuration, setPlaybackInstanceDuration] = useState(null)
  const [shouldPlay, setShouldPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [volume, setVolume] = useState(1.0)
  const [rate, setRate] = useState(1.0)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepate, setIsRepete] = useState(false)
  const [playAgain, setPlayAgain] = useState(false)
  const [play, setPlay] = useState(false)
  const [songsList, setSongsList] = useState([])
  const [timer, setTimer] = useState(0);


  //..............................................................................................................
  // const [permission, askForPermission] = usePermissions(Permissions.CAMERA, { ask: true });

  // if (!permission || permission.status !== 'granted') {
  //   return (
  //     <View>
  //       <Text>Permission is not granted</Text>
  //       <Button title="Grant permission" onPress={askForPermission} />
  //     </View>
  //   );
  // }


  const AskPermission = () => {
    Alert.alert('Permission Required', 'this app needs to read audio file', [{
      text: 'im ready',
      onPress: () => getPermission()
    }, {
      text: 'cancle',
      onPress: () => AskPermission()

    }])
  }

  const getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync()
    if (permission.granted
    ) {
      const mediaList = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' })
      setSongsList(mediaList?.assets)

    } else if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync()
      if (status === 'denied' && canAskAgain) {
        //display and alert
        AskPermission()
      }
      if (status === 'granted') {
        const mediaList = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' })
        setSongsList(mediaList?.assets)
        // console.log("🚀 ~ file: rootNavigatoe.js ~ line 57 ~ getPermission ~ mediaList", mediaList)
      }
      if (status === 'denied' && !canAskAgain) {
        //display some error to the users

      }
    }
  }

  useEffect(() => {
    getPermission()
  }, [])

  //..............................................................................................................
  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        setShouldPlay(false)
        setPlay(!play)
      }, 30000);
    }
  }, [timer, playbackInstance])



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

  }, [index, play, playAgain, isRepate, isShuffle, songsList])


  const _loadNewPlaybackInstance = async (playing) => {
    if (playbackInstance != null) {
      await playbackInstance.unloadAsync();
      playbackInstance.setOnPlaybackStatusUpdate(null);
      setPlaybackInstance(null)
      // playbackInstance = null;
    }

    const source = audioBookPlaylist[index].uri
    // const source = songsList[index]

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



  const _onForwardPressed = () => {
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

  const _onBackPressed = () => {

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


  const _trySetRate = async rate => {
    if (playbackInstance != null) {
      try {
        await playbackInstance.setRateAsync(rate);
      } catch (error) {
      }
    }
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
  //comment function is related to stop mute-unmute and rate of speed change

  // const _onRateSliderSlidingComplete = async value => {
  //   _trySetRate(value * RATE_SCALE);
  // };


  // const _onVolumeSliderValueChange = value => {
  //   if (playbackInstance != null) {
  //     playbackInstance.setVolumeAsync(value);
  //   }
  // };
  // const _onStopPressed = () => {
  //   if (playbackInstance != null) {
  //     playbackInstance.stopAsync();
  //   }
  // };
  return (
    <NavigationContainer>
      <ButtomNavigation musicPlayerFunction={{
        _onPlayPausePressed: _onPlayPausePressed,
        _onForwardPressed: _onForwardPressed,
        _onBackPressed: _onBackPressed,
        _trySetRate: _trySetRate,
        _onSeekSliderValueChange: _onSeekSliderValueChange,
        _onSeekSliderSlidingComplete: _onSeekSliderSlidingComplete,
        _getSeekSliderPosition: _getSeekSliderPosition,
        _getTimestamp: _getTimestamp,
        shuffleOnOff: shuffleOnOff,
        repateOnOff: repateOnOff,
        setShouldPlay: setShouldPlay,
        setIndex: setIndex,
        setPlay: setPlay,
        timer: timer,
        setTimer: setTimer,
        play: play,
        isBuffering: isBuffering,
        isPlaying: isPlaying,
        LOADING_STRING: LOADING_STRING,
        BUFFERING_STRING: BUFFERING_STRING,
        RATE_SCALE: RATE_SCALE,
        index: index,
        isRepate: isRepate,
        isShuffle: isShuffle,
        songsList: songsList
      }} />
    </NavigationContainer>
  );
}
