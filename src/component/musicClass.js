import React from 'react'
import { StyleSheet, TouchableOpacity, View, Image, Text, Dimensions, SafeAreaView, } from 'react-native'
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { AntDesign, Entypo, Feather } from "react-native-vector-icons"
import { Audio } from 'expo-av'
import Slider from '@react-native-community/slider';
import ProgressCircle from 'react-native-progress-circle'
import believer from './../../assets/believer.mp3'
import moron5 from './../../assets/Maroon5.mp3'
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
const Dev_Height = Dimensions.get("window").height
const Dev_Width = Dimensions.get("window").width

export default class App extends React.Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    currentIndex: 0,
    volume: 1.0,
    isBuffering: true
  }

  async componentDidMount() {
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

      this.loadAudio()
    } catch (e) {
      console.log(e)
    }
  }

  async loadAudio() {
    const { currentIndex, isPlaying, volume } = this.state

    try {
      const playbackInstance = new Audio.Sound()
      const source =
        audioBookPlaylist[currentIndex].uri


      const status = {
        shouldPlay: isPlaying,
        volume: volume
      }

      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
      await playbackInstance.loadAsync(source, status, false)
      this.setState({
        playbackInstance
      })
    } catch (e) {
      console.log(e)
    }
  }

  onPlaybackStatusUpdate = status => {
    this.setState({
      isBuffering: status.isBuffering
    })
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

    this.setState({
      isPlaying: !isPlaying
    })
  }

  handlePreviousTrack = async () => {
    let { playbackInstance, currentIndex } = this.state
    if (playbackInstance) {
      await playbackInstance.unloadAsync()
      currentIndex < audioBookPlaylist.length - 1 ? (currentIndex -= 1) : (currentIndex = 0)
      this.setState({
        currentIndex
      })
      this.loadAudio()
    }
  }

  handleNextTrack = async () => {
    let { playbackInstance, currentIndex } = this.state
    if (playbackInstance) {
      await playbackInstance.unloadAsync()
      currentIndex < audioBookPlaylist.length - 1 ? (currentIndex += 1) : (currentIndex = 0)
      this.setState({
        currentIndex
      })
      this.loadAudio()
    }
  }

  renderFileInfo() {
    const { playbackInstance, currentIndex } = this.state
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

  render() {
    return (
      // <View style={styles.container}>
      //   <Image
      //     style={styles.albumCover}
      //     source={{ uri: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg' }}
      //   />
      //   <View style={styles.controls}>
      //     <TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
      //       <Ionicons name='ios-skip-backward' size={48} color='#444' />
      //     </TouchableOpacity>
      //     <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
      //       {this.state.isPlaying ? (
      //         <Ionicons name='ios-pause' size={48} color='#444' />
      //       ) : (
      //         <Ionicons name='ios-play-circle' size={48} color='#444' />
      //       )}
      //     </TouchableOpacity>
      //     <TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
      //       <Ionicons name='ios-skip-forward' size={48} color='#444' />
      //     </TouchableOpacity>
      //   </View>
      //   {this.renderFileInfo()}

      // </View>
      <SafeAreaView style={styles.contanier}>
        <View style={styles.mainbar}>
          <AntDesign name="left" size={24} style={{ marginLeft: "5%" }} />
          <Text style={styles.now_playing_text}> Now Playing </Text>
          <Entypo name="dots-three-horizontal" size={24} style={{ marginLeft: "20%" }} />
        </View>

        <View style={styles.music_logo_view}>
          <Image source={{ uri: audioBookPlaylist[this.state.currentIndex].imageSource }} style={styles.image_view} />
        </View>

        <View style={styles.name_of_song_View} >
          <Text style={styles.name_of_song_Text1}>{audioBookPlaylist[this.state.currentIndex].title}</Text>
          <Text style={styles.name_of_song_Text2}>{audioBookPlaylist[this.state.currentIndex].author} - {audioBookPlaylist[this.state.currentIndex].source}</Text>
        </View>

        <View style={styles.slider_view}>
          <Text style={styles.slider_time}> 4:10 </Text>
          <Slider
            style={styles.slider_style}
            minimumValue={0}
            maximumValue={12.02}
            minimumTrackTintColor="#e75480"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#e75480"
            value={3.5}
          />
          <Text style={styles.slider_time}>12:02</Text>
        </View>

        <View style={styles.functions_view}>
          <Entypo name="shuffle" size={24} color="#e75480" style={{ marginLeft: "9%" }} />
          <TouchableOpacity onPress={this.handlePreviousTrack} style={{ marginLeft: "12%" }}>
            <FontAwesome5Icon name="backward" size={24} color="#e75480" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handlePlayPause} style={{ marginLeft: "12%" }}>
            {this.state.isPlaying ? (
              <FontAwesome5Icon name="pause" size={30} color="#e75480" />
            ) : (
              <FontAwesome5Icon name="play" size={30} color="#e75480" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleNextTrack} style={{ marginLeft: "12%" }}>
            <FontAwesome5Icon name="forward" size={24} color="#e75480" />
          </TouchableOpacity>
          <Feather name="repeat" size={20} color="#e75480" style={{ marginLeft: "10%" }} />
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
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   albumCover: {
//     width: 250,
//     height: 250
//   },
//   trackInfo: {
//     padding: 40,
//     backgroundColor: '#fff'
//   },

//   trackInfoText: {
//     textAlign: 'center',
//     flexWrap: 'wrap',
//     color: '#550088'
//   },
//   largeText: {
//     fontSize: 22
//   },
//   smallText: {
//     fontSize: 16
//   },
//   control: {
//     margin: 20
//   },
//   controls: {
//     flexDirection: 'row'
//   }
// })


// import * as React from 'react';
// import {
//   Text,
//   View,
//   StyleSheet,
//   SafeAreaView,
//   Image,
//   Dimensions
// } from 'react-native';

// const Dev_Height = Dimensions.get("window").height
// const Dev_Width = Dimensions.get("window").width

// import { AntDesign, Entypo, Feather } from "react-native-vector-icons"
// import Slider from '@react-native-community/slider';
// import ProgressCircle from 'react-native-progress-circle'

// export default class App extends React.Component {
//   render() {
//     return (
// <SafeAreaView style={styles.contanier}>
//   <View style={styles.mainbar}>
//     <AntDesign name="left" size={24} style={{ marginLeft: "5%" }} />
//     <Text style={styles.now_playing_text}> Now Playing </Text>
//     <Entypo name="dots-three-horizontal" size={24} style={{ marginLeft: "20%" }} />
//   </View>

//   <View style={styles.music_logo_view}>
//     <Image source={{uri: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'}} style={styles.image_view} />
//   </View>

//   <View style={styles.name_of_song_View} >
//     <Text style={styles.name_of_song_Text1}>#02 - Practice</Text>
//     <Text style={styles.name_of_song_Text2}>Digital Marketing - By Setup Cast</Text>
//   </View>

//   <View style={styles.slider_view}>
//     <Text style={styles.slider_time}> 4:10 </Text>
//     <Slider
//       style={styles.slider_style}
//       minimumValue={0}
//       maximumValue={12.02}
//       minimumTrackTintColor="#e75480"
//       maximumTrackTintColor="#d3d3d3"
//       thumbTintColor="#e75480"
//       value={3.5}
//     />
//     <Text style={styles.slider_time}>12:02</Text>
//   </View>

//   <View style={styles.functions_view}>
//     <Entypo name="shuffle" size={24} color="#e75480" style={{ marginLeft: "9%" }} />
//     <Entypo name="controller-fast-backward" size={24} color="#e75480" style={{ marginLeft: "12%" }} />
//     <AntDesign name="pausecircle" size={50} color="#e75480" style={{ marginLeft: "12%" }} />
//     <Entypo name="controller-fast-forward" size={24} color="#e75480" style={{ marginLeft: "12%" }} />
//     <Feather name="repeat" size={20} color="#e75480" style={{ marginLeft: "10%" }} />
//   </View>

//   <View style={styles.recently_played_view}>
//     <Text style={styles.recently_played_text}> Recently Played </Text>
//     <View style={styles.recently_played_list}>
//       <Image source={require("./assets/logo.jpg")} style={styles.recently_played_image} />
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
//     )
//   }
// }


