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
  MusicList: MusicList,
  MusicPlayPage: MusicPlayPage,
};


export default function MusicPlayerStack({ musicPlayerFunction }) {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {Object.entries(MusicPlayerScreen).map(([name, Component]) => (
        <Stack.Screen name={name}
          children={(props) => <Component {...props} musicPlayerFunction={musicPlayerFunction} />} key={name}
        />
      ))}
    </Stack.Navigator>
  );
}

