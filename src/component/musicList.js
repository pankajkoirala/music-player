import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { audioBookPlaylist } from './musicListArray'


export default MusicList = (props) => {
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>
          MUSIC LIST
        </Text>
      </View>
      <ScrollView bounces={false}>
        {audioBookPlaylist.map((arg, i) => {
          return (
            <TouchableOpacity onPress={() => props.navigation.navigate('MusicPlayPage', { musicIndex: i })
            } key={i} style={styles.musicBox}>
              <Text>{arg.title}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

    </View >
  )
}
const styles = StyleSheet.create({

  musicBox: {
    alignSelf: "center",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 2,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    width: "95%",

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  }
});