import { StyleSheet, Text, View, Dimensions } from 'react-native'
import {useState} from 'react'

const { width, height } = Dimensions.get('window');

const DisplaySelection = ({option}) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [fontSize, setFontSize] = useState(13);

    const genRandomKey = () => {
        return Math.floor(Math.random() * 9999999)
      }

  return (
<View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
      }}
      key={option.title}
      style={[styles.optionContainer]}
    >
      {option && 
      <View
      key={`${genRandomKey()}`}
        style={{
          backgroundColor: option.color,
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1,
          elevation: 10,
          width: '80%',
          height: '80%',
          alignSelf: 'center',
          color: 'black'
        }}
      >
        {containerHeight && containerWidth && fontSize ? (
          <Text style={[styles.optionText, { fontSize }]}>{option.title}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>}
    </View>
  )
}

export default DisplaySelection

const styles = StyleSheet.create({
    optionContainer: {
      width: width * 0.5,
      height: height * 0.9 / 4.5,
      padding: 10,
      color: 'black'
    },
    optionText: {
      fontFamily: 'Fredoka',
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 0,
      color: 'black'
    },
  });