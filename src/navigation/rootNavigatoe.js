import React, { Component, useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import ButtomNavigation from "./buttomNav";
import { Audio } from "expo-av";
import { audioBookPlaylist } from "./../component/musicListArray";
//redux
import { AudioContext } from "../context/audioProvider";
import { _advanceIndex } from "../context/audioFunction";
import { getPermission, AskPermission } from "../component/musicPermission";



export default function AppStack(props) {
  const context = useContext(AudioContext);
  const {
    index,
    setIndex,
    playbackInstance,
    setPlaybackInstance,
    setPlaybackInstancePosition,
    setPlaybackInstanceDuration,
    shouldPlay,
    setShouldPlay,
    isPlaying,
    setIsPlaying,
    setIsBuffering,
    volume,
    rate,
    setRate,
    isShuffle,
    isRepate,
    playAgain,
    setPlayAgain,
    play,
    setPlay,
    songsList,
    setSongsList,
    timer,
  } = context;

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

  // const AskPermission = () => {
  //   Alert.alert("Permission Required", "this app needs to read audio file", [
  //     {
  //       text: "im ready",
  //       onPress: () => getPermission(),
  //     },
  //     {
  //       text: "cancle",
  //       onPress: () => AskPermission(),
  //     },
  //   ]);
  // };

  // const getPermission = async () => {
  //   const permission = await MediaLibrary.getPermissionsAsync();
  //   if (permission.granted) {
  //     const mediaList = await MediaLibrary.getAssetsAsync({
  //       mediaType: "audio",
  //     });
  //     setSongsList(mediaList?.assets);

  //   } else if (!permission.granted && permission.canAskAgain) {
  //     const { status, canAskAgain } =
  //       await MediaLibrary.requestPermissionsAsync();
  //     if (status === "denied" && canAskAgain) {
  //       //display and alert
  //       AskPermission();
  //     }
  //     if (status === "granted") {
  //       const mediaList = await MediaLibrary.getAssetsAsync({
  //         mediaType: "audio",
  //       });
  //       setSongsList(mediaList?.assets);
  //       // console.log("🚀 ~ file: rootNavigatoe.js ~ line 57 ~ getPermission ~ mediaList", mediaList)
  //     }
  //     if (status === "denied" && !canAskAgain) {
  //       //display some error to the users
  //     }
  //   }
  // };

  useEffect(() => {
    getPermission(AskPermission, getPermission, setSongsList);
  }, []);

  //..............................................................................................................
  // useEffect(() => {
  //   if (isPlaying) {
  //     setTimeout(() => {
  //       setShouldPlay(false);
  //       setPlay(!play);
  //     }, 30000);
  //   }
  // }, [timer, playbackInstance]);

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
          playThroughEarpieceAndroid: false,
        });

        _loadNewPlaybackInstance(shouldPlay);
      } catch (e) {
        console.log(e);
      }
    }
    if (songsList?.length) {
      apple();
    }
  }, [index, play, playAgain, isRepate, isShuffle, songsList]);

  const _loadNewPlaybackInstance = async (playing) => {
    if (playbackInstance != null) {
      await playbackInstance.unloadAsync();
      playbackInstance.setOnPlaybackStatusUpdate(null);
      setPlaybackInstance(null);
      // playbackInstance = null;
    }

    const source = songsList[index];
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
    setPlaybackInstance(sound);
  };

  const _onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackInstancePosition(status.positionMillis);
      setPlaybackInstanceDuration(status.durationMillis);
      setShouldPlay(status.shouldPlay);
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      setRate(status.rate);
      if (status.didJustFinish) {
        if (isRepate === true) {
          setShouldPlay(true);
          setPlayAgain(!playAgain);
        } else {
          setShouldPlay(true);
          _advanceIndex(true, isShuffle, audioBookPlaylist, index, setIndex);
        }
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };
  return (
    <NavigationContainer>
      <ButtomNavigation />
    </NavigationContainer>
  );
}
