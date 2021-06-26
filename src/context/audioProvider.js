import React, { createContext } from 'react';
import { Text, View, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
// import { storeAudioForNextOpening } from '../misc/helper';
// import { playNext } from '../misc/audioController';
import { useEffect } from 'react';
import { useState } from 'react';
export const AudioContext = createContext();

export const AudioProvider = (props) => {
  const [index, setIndex] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false)
  const [permissionError, setPermissionError] = useState(false)
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
  const [isMute, setIsMute] = useState(false)



  //permision asking to load music file 


  useEffect(() => {
    getPermission()
  }, [])


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

  //timer 
  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        setShouldPlay(false)
        setPlay(!play)
      }, 30000);
    }
  }, [timer, playbackInstance])






  if (permissionError)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 25, textAlign: 'center', color: 'red' }}>
          It looks like you haven't accept the permission.
        </Text>
      </View>
    );
  return (
    <AudioContext.Provider
      value={{
        index: index,
        isSeeking: isSeeking,
        shouldPlayAtEndOfSeek: shouldPlayAtEndOfSeek,
        playbackInstance: playbackInstance,
        playbackInstancePosition: playbackInstancePosition,
        playbackInstanceDuration: playbackInstanceDuration,
        shouldPlay: shouldPlay,
        isPlaying: isPlaying,
        isBuffering: isBuffering,
        volume: volume,
        rate: rate,
        isShuffle: isShuffle,
        isRepate: isRepate,
        playAgain: playAgain,
        play: play,
        songsList: songsList,
        timer: timer,
        isMute: isMute,
        setIsMute: setIsMute,
        setIndex: setIndex,
        setIsSeeking: setIsSeeking,
        setShouldPlayAtEndOfSeek: setShouldPlayAtEndOfSeek,
        setPlaybackInstance: setPlaybackInstance,
        setPlaybackInstancePosition: setPlaybackInstancePosition,
        setPlaybackInstanceDuration: setPlaybackInstanceDuration,
        setShouldPlay: setShouldPlay,
        setIsPlaying: setIsPlaying,
        setIsBuffering: setIsBuffering,
        setVolume: setVolume,
        setRate: setRate,
        setIsShuffle: setIsShuffle,
        setIsRepete: setIsRepete,
        setPlayAgain: setPlayAgain,
        setPlay: setPlay,
        setSongsList: setSongsList,
        setTimer: setTimer,
      }}
    >
      {props.children}
    </AudioContext.Provider>
  );
}

export default AudioProvider;
