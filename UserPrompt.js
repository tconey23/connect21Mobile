import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native'
import React from 'react'
import { Modal } from 'react-native'
import { Alert, BackHandler } from 'react-native'

const { width, height } = Dimensions.get('window')

const UserPrompt = () => {

    const closeApp = () => {

        if(Platform.OS === 'android'){
            Alert.alert(
                'Exit App',
                'Do you want to exit?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'OK', onPress: () => BackHandler.exitApp() },
                ],
                { cancelable: true }
            );
        }
      };

  return (
        <View style={styles.container}> 
            <View style={styles.textContainer}>
                <Text style={styles.text}>Thank you for playing today's 21Things!</Text>
                <Text style={styles.text}>Check back in tomorrow for a new category</Text>
                {Platform.OS === 'android' && <TouchableOpacity onPress={() => closeApp()} style={styles.button}><Text>EXIT</Text></TouchableOpacity>}
            </View>
        </View>
  )
}

export default UserPrompt

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        zIndex: 10000,
        position: 'absolute',
        backgroundColor: 'gray',
        opacity: 0.8
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        elevation: 25
    },
    text: {
       textAlign: 'center',
       fontFamily: 'Fredoka',
       fontSize: 18
    },
    buttonText: {
        fontSize: 20,
        fontFamily: 'Fredoka',
        fontWeight: '800',
      },
      button: {
        backgroundColor: '#BDFDFF',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 5,
        elevation: 15,
        zIndex: 10000
      },
})