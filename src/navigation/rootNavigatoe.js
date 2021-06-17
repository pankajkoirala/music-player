import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import ButtomNavigation from "./buttomNav";

//redux

export default function AppStack(props) {

  return (
    <NavigationContainer>
      <ButtomNavigation />
    </NavigationContainer>
  );
}
