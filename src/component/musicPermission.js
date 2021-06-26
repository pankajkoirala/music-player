import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";

export const AskPermission = (getPermission, AskPermission) => {
  Alert.alert("Permission Required", "this app needs to read audio file", [
    {
      text: "im ready",
      onPress: () => getPermission(),
    },
    {
      text: "cancle",
      onPress: () => AskPermission(),
    },
  ]);
};


export const getPermission = async (AskPermission, getPermission, setSongsList) => {
  const permission = await MediaLibrary.getPermissionsAsync();
  if (permission.granted) {
    const mediaList = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    setSongsList(mediaList?.assets);

  } else if (!permission.granted && permission.canAskAgain) {
    const { status, canAskAgain } =
      await MediaLibrary.requestPermissionsAsync();
    if (status === "denied" && canAskAgain) {
      //display and alert
      AskPermission(getPermission, AskPermission);
    }
    if (status === "granted") {
      const mediaList = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
      });
      setSongsList(mediaList?.assets);
      // console.log("🚀 ~ file: rootNavigatoe.js ~ line 57 ~ getPermission ~ mediaList", mediaList)
    }
    if (status === "denied" && !canAskAgain) {
      //display some error to the users
    }
  }
};