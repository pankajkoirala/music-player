import React from 'react'
import { StyleSheet, TouchableOpacity, View, Image, Text, Dimensions, SafeAreaView, } from 'react-native'
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { AntDesign, Entypo, Feather } from "react-native-vector-icons"
import { Audio } from 'expo-av'
import Slider from '@react-native-community/slider';
import ProgressCircle from 'react-native-progress-circle'
import believer from './../../assets/believer.mp3'
import moron5 from './../../assets/Maroon5.mp3'
import { useState } from 'react'
import { useEffect } from 'react';

const Dev_Height = Dimensions.get("window").height
const Dev_Width = Dimensions.get("window").width
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
export default MusicFunction = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackInstance, setPlaybackInstance] = useState(null)
  // console.log("🚀 ~ file: musicFunction.js ~ line 36 ~ playbackInstance", playbackInstance)
  const [currentIndex, setCurrentIndex] = useState(0)
  // console.log("🚀 ~ file: musicFunction.js ~ line 37 ~ currentIndex", currentIndex)
  const [volume, setVolume] = useState(1)
  const [isBuffering, setIsBuffering] = useState(true)


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

  }, [currentIndex])

  const loadAudio = async () => {

    try {
      const playbackInstance = new Audio.Sound()
      const source =
        audioBookPlaylist[currentIndex].uri


      const status = {
        shouldPlay: isPlaying,
        volume: volume
      }

      playbackInstance.setOnPlaybackStatusUpdate((arg) => onPlaybackStatusUpdate(arg))
      await playbackInstance.loadAsync(source, status, false)

      setPlaybackInstance(playbackInstance)
    } catch (e) {
      console.log(e)
    }
  }

  const onPlaybackStatusUpdate = status => {
    setIsBuffering(status.isBuffering)
  }

  const handlePlayPause = async () => {
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

    setIsPlaying(!isPlaying)
  }
  // console.log("🚀 ~ file: musicFunction.js ~ line 97 ~ handlePlayPause ~ playbackInstance", playbackInstance)

  const handlePreviousTrack = () => {
    if (playbackInstance) {
      playbackInstance.unloadAsync()
      if (currentIndex === 0) {
        setCurrentIndex(audioBookPlaylist.length - 1)
      } else {
        setCurrentIndex(currentIndex - 1)
      }
      // loadAudio()
    }
  }

  const handleNextTrack = () => {
    if (playbackInstance) {
      playbackInstance.unloadAsync()
      if (currentIndex === audioBookPlaylist.length - 1) {
        setCurrentIndex(0)
      } else {
        setCurrentIndex(currentIndex + 1)
      }
      // loadAudio()
    }
  }



  const renderFileInfo = () => {
    return playbackInstance ? (
      <View style={styles.trackInfo}>
        <Text style={[styles.trackInfoText, styles.largeText]}>
          {audioBookPlaylist[currentIndex].title}
        </Text>
        <Text style={[styles.trackInfoText, styles.smallText]}>
          {audioBookPlaylist[currentIndex].author}
        </Text>
        <Text style={[styles.trackInfoText, styles.smallText]}>
          {audioBookPlaylist[currentIndex].source}
        </Text>
      </View>
    ) : null
  }
  return (
    <SafeAreaView style={styles.contanier}>
      <View style={styles.mainbar}>
        <AntDesign name="left" size={24} style={{ marginLeft: "5%" }} />
        <Text style={styles.now_playing_text}> Now Playing </Text>
        <Entypo name="dots-three-horizontal" size={24} style={{ marginLeft: "20%" }} />
      </View>

      <View style={styles.music_logo_view}>
        <Image source={{ uri: audioBookPlaylist[currentIndex].imageSource }} style={styles.image_view} />
      </View>

      <View style={styles.name_of_song_View} >
        <Text style={styles.name_of_song_Text1}>{audioBookPlaylist[currentIndex].title}</Text>
        <Text style={styles.name_of_song_Text2}>{audioBookPlaylist[currentIndex].author} - {audioBookPlaylist[currentIndex].source}</Text>
      </View>

      <View style={styles.slider_view}>
        <Text style={styles.slider_time}> 4:10 </Text>
        <Slider
          style={styles.slider_style}
          minimumValue={0}
          maximumValue={60000}
          onValueChange={async (e) => {
            try {
              await playbackInstance.playFromPositionAsync(e)

            } catch (error) {
              console.log(error)
            }
          }


            // async (e) => {
            //   const Mill = await playbackInstance.getStatusAsync();
            //   let currentposition = Mill.positionMillis;
            //   let totalposition = Mill.durationMillis;
            //   playbackInstance.setStatusAsync({ ...Mill, positionMillis: e, })
            //   console.log(Mill)
            // }
            // async (e) => {
            //   try {
            //     await playbackInstance.setStatusAsync({ positionMillis: e, hasJustBeenInterrupted: true, playableDurationMillis: e })
            //   } catch (error) {
            //     console.log("slier music error", error)
            //   }
            // }

          }

          minimumTrackTintColor="#e75480"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#e75480"

        />
        <Text style={styles.slider_time}>12:02</Text>
      </View>

      <View style={styles.functions_view}>
        <Entypo name="shuffle" size={24} color="#e75480" style={{ marginLeft: "9%" }} />
        <TouchableOpacity onPress={() => handlePreviousTrack()} style={{ marginLeft: "12%" }}>
          <FontAwesome5Icon name="backward" size={24} color="#e75480" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePlayPause()} style={{ marginLeft: "12%" }}>
          {isPlaying ? (
            <FontAwesome5Icon name="pause" size={30} color="#e75480" />
          ) : (
            <FontAwesome5Icon name="play" size={30} color="#e75480" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNextTrack()} style={{ marginLeft: "12%" }}>
          <FontAwesome5Icon name="forward" size={24} color="#e75480" />
        </TouchableOpacity>
        <Feather name="repeat" size={20} color="#e75480" style={{ marginLeft: "10%" }} />
      </View>
      <Text>Volume</Text>
      <View style={styles.slider_view_volume}>
        <FontAwesome5Icon name='volume-off' size={35} style={styles.slider_time} />
        <Slider
          style={styles.slider_style}
          minimumValue={0}
          maximumValue={1}
          onValueChange={(e) => playbackInstance.setVolumeAsync(e.toFixed(2))}
          minimumTrackTintColor="#e75480"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#e75480"
          value={volume}
        />
        <FontAwesome5Icon name='volume-up' size={35} style={styles.slider_time} />
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
              percent={40}
              radius={25}
              borderWidth={5}
              color="#e75480"
              shadowColor="#FFF"
              bgColor="#fff">
              <AntDesign name="play" size={37} color="#e75480" style={{ marginTop: "4%" }} />
            </ProgressCircle>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  contanier: {
    height: Dev_Height,
    width: Dev_Width
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
    width: "50%",
    alignItems: "center",
    flexDirection: "row"
  },
  slider_style: {
    height: "70%",
    width: "60%"
  },
  slider_time: {
    fontSize: 15,
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
})