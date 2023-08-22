import {
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFonts } from "expo-font";
import RenderDataRow from "./Components/RenderDataRow";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import moment from "moment";

export default function App() {
  const animation = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dailyDataObj, setDailyDataObj] = useState([]);
  const [city, setCity] = useState("");
  const [currentData, setCurrentData] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 0);
  }, []);

  const addWeatherData = (dataObj, location) => {
    setCurrentData({
      icon: dataObj.current.weather[0].icon,
      temp: dataObj.current.temp,
      desc: dataObj.current.weather[0].main,
      dt: dataObj.current.dt,
    });

    let tempData = [];
    dataObj.daily.map((dailyData, index) => {
      if (index !== 0) {
        tempData.push({
          id: dailyData.dt,
          day: new Date(dailyData.dt * 1000)
            .toLocaleDateString("en", { weekday: "long" })
            .split(",")[0]
            .substr(0, 3)
            .toUpperCase(),
          maxTemp: Math.floor(dailyData.temp.max),
          minTemp: Math.floor(dailyData.temp.min),
          condition: dailyData.weather[0].main,
          icon: dailyData.weather[0].icon,
        });
      }
    });
    setDailyDataObj(tempData);
    fetchLocation(location);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      postData(location);
    })();
  }, []);

  const postData = async (location) => {
    try {
      let res = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&ctn=7&appid=c1c713359ee51a22f65c9483054ea32c`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      res = await res.json();
      addWeatherData(res, location);
    } catch (e) {}
  };

  const fetchLocation = async (location) => {
    try {
      let res = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${location.coords.latitude}0&lon=${location.coords.longitude}&limit=1&appid=c1c713359ee51a22f65c9483054ea32c`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      res = await res.json();
      setCity(res[0].name + ", " + res[0].state);
      setLoading(false);
    } catch (e) {}
  };

  const [fontsLoaded] = useFonts({
    "Font-Regular": require("./assets/AppAssets/Fonts/RobotoCondensed-Light.ttf"),
    "Font-Medium": require("./assets/AppAssets/Fonts/RobotoCondensed-Regular.ttf"),
    "Font-Bold": require("./assets/AppAssets/Fonts/RobotoCondensed-Bold.ttf"),
  });

  return (
    <SafeAreaView style={styles.container}>
      <Modal animationType="slide" visible={loading}>
        <View style={styles.centeredView}>
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 200,
              height: 200,
            }}
            source={require("./assets/Lottie/location.json")}
          />
        </View>
      </Modal>

      <StatusBar backgroundColor={"#FFFFFF"} barStyle={"dark-content"} />

      <View style={styles.topShelf}>
        <Text style={styles.name}>{city}</Text>
        <TouchableOpacity style={styles.menuContainer}>
          <View style={styles.lineOne}></View>
          <View style={[styles.lineOne, { width: 22, marginTop: 5 }]}></View>
        </TouchableOpacity>
      </View>
      <Text style={styles.subTitle}>
        {moment(currentData.dt).format("dddd")},{" "}
        {moment(currentData.dt).utcOffset("+0530").format("LT")}
      </Text>

      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            source={{
              uri: `https://openweathermap.org/img/wn/${currentData.icon}@2x.png`,
            }}
            style={{ width: "150%", height: "150%" }}
          />
        </View>
        <Text style={styles.temperature}>{Math.floor(currentData.temp)}°</Text>
        <Text style={styles.condition}>{currentData.desc}</Text>

        <View style={styles.weekContainer}>
          <Text style={styles.lineStyle}>This Week</Text>
          {dailyDataObj.map((eachData) => {
            return <RenderDataRow key={eachData.id} weatherData={eachData} />;
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  name: {
    color: "#3c3c3c",
    fontSize: 32,
    // fontFamily: "Font-Medium",
    fontWeight: "400",
  },
  topShelf: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "2%",
  },
  lineOne: {
    width: 15,
    height: 2,
    backgroundColor: "#cdcdcd",
    borderRadius: 5,
  },
  menuContainer: {
    alignItems: "flex-end",
  },
  subTitle: {
    color: "#9d9d9d",
    fontSize: 20,
    // fontFamily: "Font-Medium",
    fontWeight: "400",
    marginLeft: "6%",
    marginTop: "1%",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  weekContainer: {
    width: "95%",
    backgroundColor: "#f8f8f8",
    alignSelf: "center",
    borderRadius: 20,
    paddingVertical: "10%",
    paddingHorizontal: "5%",
  },
  lineStyle: {
    // fontFamily: "Font-Bold",
    fontWeight: "600",
    fontSize: 18,
    color: "#373737",
    marginBottom: "2%",
  },
  imageContainer: {
    width: 100,
    height: 100,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  temperature: {
    color: "#333333",
    alignSelf: "center",
    fontSize: 42,
    // fontFamily: "Font-Bold",
    fontWeight: "600",
    marginTop: "2%",
  },
  condition: {
    color: "#8e8e8e",
    alignSelf: "center",
    fontSize: 20,
    // fontFamily: "Font-Medium",
    fontWeight: "400",
    marginBottom: "10%",
    marginTop: "1%",
  },
  centeredView: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
