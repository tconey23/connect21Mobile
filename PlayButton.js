import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from "@react-spring/native";

const { width, height } = Dimensions.get('window');

const PlayButton = ({setStartGame}) => {
    const [purple] = useState('#c956ff');
    const AnimatedButton = animated(TouchableOpacity);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const [isWobbling, setIsWobbling] = useState(true)

    const wobble =  useSpring({
    to: async (next) => {
      if (isWobbling) {
        for (let i = 0; i < 3; i++) {
          await next({ rotate: "10deg", config: { duration: 100 } });
          await next({ rotate: "-10deg", config: { duration: 100 } });
        }
        await next({ rotate: "0deg", config: { duration: 50 } });
        await delay(500)
        setIsWobbling(false);
      }
    },
    from: { rotate: "0deg" },
    reset: true,
  });

  useEffect(() =>{
    if(!isWobbling){
      setIsWobbling(true)
    }
  }, [isWobbling])
    return (
        <AnimatedButton
        style={{ transform: [{ rotate: wobble.rotate }] }}
      >
        <TouchableOpacity
          onPress={() => setStartGame(true)} // Start game when pressed
          style={[styles.button, { backgroundColor: purple }]}
        >
          <Text style={styles.buttonText}>PLAY!</Text>
        </TouchableOpacity>
      </AnimatedButton>
    )
}

export default PlayButton

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: 'white',
      marginTop: 10,
      flex: 1,
    },
    text: {
      fontSize: 50,
      fontFamily: 'Fredoka',
      textAlign: 'center',
      alignSelf: 'center',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 10,
      marginTop: -50,
    },
    titleContainer: {
      flexDirection: 'row',
      paddingVertical: 30,
    },
    hexContainer: {
      width: 200,
      height: 200,
      marginTop: 0,
      marginBottom: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 20,
      fontFamily: 'Fredoka',
      fontWeight: '800',
    },
    button: {
      paddingHorizontal: 30,
      paddingVertical: 10,
      borderRadius: 5,
      elevation: 15,
    },
    catText: {
      fontSize: 30,
      width: '100%',
      textAlign: 'center',
    },
    categoryWrapper: {
      backgroundColor: 'white',
      height: height * 0.1,
      width: width * 0.85,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      borderRadius: 20,
      marginTop: -80,
    },
  });
  