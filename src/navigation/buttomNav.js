import React, { Component, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { MusicListStack, MusicPlayerStack } from "./stack";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import NewComponent from './../component/newPlaylistFunction'
import Stack from "./stack";
import {
  Text,
  ImageBackground,
  View,
  Image,
  Animated,
  Easing,
} from "react-native";

import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

class MyIcon extends Component {
  render() {
    return (
      <FontAwesome5
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
  let opacityValue = new Animated.Value(0);
  let marginValue = new Animated.Value(0);
  let bgColorValue = new Animated.Value(0);
  let iconValue = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(bgColorValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.spring(iconValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.spring(marginValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.spring(opacityValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [state]);

  function animateOpacity() {
    // marginValue.setValue( -20);
    Animated.parallel(
      [
        Animated.timing(bgColorValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(iconValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(marginValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ],
      { stopTogether: true }
    ).start(() => {
      Animated.parallel([
        Animated.spring(bgColorValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.spring(iconValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.spring(marginValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.spring(opacityValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // const event = navigation.emit({
        //   type: 'tabPress',
        //   target: route.key,
        //   canPreventDefault: true,
        // });
        if (!isFocused) {
          navigation.navigate(route.name);
        }
      });
    });
  }

  let marginal = marginValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  let opacity = opacityValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  let bgColor = bgColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f7f7f7", "#e75480"],
  });

  let iconColor = iconValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e75480", "#f7f7f7"],
  });

  const onPress = () => {
    animateOpacity();

    // const event = navigation.emit({
    //   type: "tabPress",
    //   target: route.key,
    //   canPreventDefault: true,
    // });

    // setTimeout(()=> {
    //   if (!isFocused && !event.defaultPrevented) {
    //     navigation.navigate(route.name);
    //   }
    // },2000)
  };

  // const onLongPress = () => {
  //   navigation.emit({
  //     type: 'tabLongPress',
  //     target: route.key,
  //   });
  // };

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
      <Animated.View
        style={{
          transform: [
            {
              translateY: marginal,
            },
          ],
          backgroundColor: "#f7f7f7",
          padding: 5,
          paddingBottom: 0,
          borderRadius: 50,
        }}
      >
        <Animated.View
          style={{
            backgroundColor: bgColor,
            padding: 5,
            paddingBottom: 0,
            borderRadius: 50,
          }}
        >
          <AnimatedIcon
            name={options.icon}
            iconType={options.iconType || null}
            color={iconColor}
            size={30}
          />
        </Animated.View>
        <Animated.Text style={{ color: "#2E7F9F", opacity: opacity }}>
          {label}
        </Animated.Text>
      </Animated.View>
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

const TabNavigator = (props) => {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        name="MusicList"
        component={MusicListStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          return {
            // tabBarVisible: !(routeName === "LogIn" || routeName === "Register"),
            icon: "list",
          };
        }}
      />
      <Tab.Screen
        name="Player"
        component={MusicPlayerStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          return {
            icon: "headphones",
            iconType: "font-awesome",
          };
        }}
      />

      <Tab.Screen
        name="Player2"
        component={MusicPlayerStack}
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

