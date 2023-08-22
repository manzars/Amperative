import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

const RenderDataRow = ({ weatherData }) => {
  return (
    <View style={styles.dataContainer}>
      <Text style={styles.weekStyle}>{weatherData.day}</Text>
      <Text
        style={[
          styles.weekStyle,
          {
            color: "#49494b",
            width: "10%",
            // fontFamily: "Font-Bold",
            fontWeight: "600",
            textAlign: "center",
          },
        ]}
      >
        {weatherData.maxTemp}°
      </Text>
      <Text
        style={[
          styles.weekStyle,
          {
            textAlign: "center",
            fontSize: 12,
            width: "10%",
            marginBottom: 2,
          },
        ]}
      >
        {weatherData.minTemp}°
      </Text>
      <View style={{ width: "10%" }}></View>
      <View style={styles.innerDataContainer}>
        <View
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            resizeMode="contain"
            source={{
              uri: `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`,
            }}
            style={{ width: "150%", height: "150%" }}
          />
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.weekStyle,
            {
              width: "75%",
              color: "#727274",
              //  fontFamily: "Font-Bold" ,
              fontWeight: "600",
            },
          ]}
        >
          {weatherData.condition}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dataContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "1.5%",
  },
  innerDataContainer: {
    flexDirection: "row",
    width: "45%",
    alignItems: "center",
  },
  weekStyle: {
    width: "25%",
    // fontFamily: "Font-Medium",
    fontWeight: "400",
    color: "#9b9b9b",
    letterSpacing: 1.5,
    fontSize: 14,
  },
});

export default RenderDataRow;
