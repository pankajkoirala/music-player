import React from "react";
import { Header } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import MusicPlayPage from "../component/newPlaylistFunction";
import MusicList from "../component/musicList";



const Stack = createStackNavigator();

//page header
export function PageHeader(props) {
  return (
    <Header
      leftComponent={{
        icon: "menu",
        color: "#fff",
        onPress: () => props.navigation.openDrawer(),
      }}
      centerComponent={{ text: props.title, style: { color: "#fff" } }}
      rightComponent={{
        icon: "home",
        color: "#fff",
        onPress: () => props.navigation.navigate("Home"),
      }}
    />
  );
}

const MusicPlayerScreen = {
  MusicPlayPage: MusicPlayPage,
  MusicList: MusicList

};


export function MusicPlayerStack(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {Object.entries(MusicPlayerScreen).map(([name, component]) => (
        <Stack.Screen name={name} component={component} key={name} />
      ))}
    </Stack.Navigator>
  );
}
const MusicListScreen = {
  MusicList: MusicList,
  MusicList: MusicList

};
export function MusicListStack(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {Object.entries(MusicListScreen).map(([name, component]) => (
        <Stack.Screen name={name} component={component} key={name} />
      ))}
    </Stack.Navigator>
  );
}
