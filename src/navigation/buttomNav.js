
import MusicPlayerStack from "./stack";
import PlayerScreen from './../component/newPlaylistFunction'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import React, { Component, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  Text,
  View,
  Animated,
} from "react-native";

import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native";


const Tab = createBottomTabNavigator();

class MyIcon extends Component {
  render() {
    return (
      <Icon
        name={this.props.name}
        type={this.props.iconType}
        color={this.props.color}
        size={30}
      />
    );
  }
}
const AnimatedIcon = Animated.createAnimatedComponent(MyIcon);

function MyTabs({ descriptors, state, route, navigation, index }) {
  const { options } = descriptors[route.key];
  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
        ? options.title
        : route.name;

  const isFocused = state.index === index;

  const onPress = () => {
    if (!isFocused) {
      navigation.navigate(route.name);
    }
  };



  return (
    <TouchableOpacity
      accessibilityRole="button"
      key={label}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      // onLongPress={onLongPress}
      style={{ flex: 1, alignItems: "center" }}
    >
      <View
        style={{
          transform: [
            // {
            //   translateY: marginal,
            // },
          ],
          backgroundColor: "#f7f7f7",
          padding: 5,
          paddingBottom: 0,
          borderRadius: 50,
        }}
      >
        <View
          style={{
            // backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
            paddingBottom: 0,
            borderRadius: 50,
            height: 50,
            width: 50,
            backgroundColor: isFocused ? 'pink' : 'transparent',
          }}
        >
          <FontAwesome5
            name={options.icon}
            iconType={options.iconType || null}
            color={'#e75480'}
            size={30}
          />
        </View>
        <Text style={{ color: "#2E7F9F", }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
function MyTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        paddingTop: 5,
        paddingHorizontal: 20,
        backgroundColor: "#f7f7f7",
      }}
    >
      {state.routes.map((route, index) => {
        return (
          <MyTabs
            key={index}
            descriptors={descriptors}
            route={route}
            navigation={navigation}
            state={state}
            index={index}
          />
        );
      })}
    </View>
  );
}

const TabNavigator = ({ musicPlayerFunction }) => {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Home"

        children={(props) => <MusicPlayerStack {...props} musicPlayerFunction={musicPlayerFunction} />}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          return {
            // tabBarVisible: !(routeName === "LogIn" || routeName === "Register"),
            icon: "home",
          };
        }}
      />
      <Tab.Screen
        name="Doctors"
        children={(props) => <PlayerScreen {...props} musicPlayerFunction={musicPlayerFunction} />}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          return {
            icon: "stethoscope",
            iconType: "font-awesome",
          };
        }}
      />

      <Tab.Screen
        name="Medicines"
        children={(props) => <PlayerScreen {...props} musicPlayerFunction={musicPlayerFunction} />}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          return {
            icon: "medkit",
            iconType: "font-awesome",
          };
        }}
      />

    </Tab.Navigator>
  );
};

export default TabNavigator;

