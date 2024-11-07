import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

function HexButton({ name, size, strokeColor = "#000", strokeSize = 1 }) {

  const [purple] = useState('#c956ff')
  const [yellow] = useState('#fff200')
  const [green] = useState('#45d500')

  return (

    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 186 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M135.435 25.5L93 99L50.5648 25.5L135.435 25.5Z" fill={purple} stroke={strokeColor} strokeWidth={strokeSize} />
        <Path d="M7.56476 99.5L50 26L92.4352 99.5H7.56476Z" fill={purple} stroke={strokeColor} strokeWidth={strokeSize} />
        <Path d="M93.5648 99.5L136 26L178.435 99.5H93.5648Z" fill={purple} stroke={strokeColor} strokeWidth={strokeSize} />
        <Path d="M50.5648 174.5L93 101L135.435 174.5H50.5648Z" fill={green} stroke={strokeColor} strokeWidth={strokeSize} />
        <Path d="M178.435 100.5L136 174L93.5648 100.5L178.435 100.5Z" fill={yellow} stroke={strokeColor} strokeWidth={strokeSize} />
        <Path d="M92.4352 100.5L50 174L7.56476 100.5L92.4352 100.5Z" fill={yellow} stroke={strokeColor} strokeWidth={strokeSize} />
      </Svg>
    </View>
  );
}

export default HexButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#ffffff00'
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#ffffff00',
  },
  shadow: {
    zIndex: 2,
    opacity: 1,
  },
});
