import React, { Component, useEffect } from 'react'
import { Text, View } from 'react-native'
import { Alert, BackHandler } from 'react-native'

const BetaAlert = ({setToggleHelp}) => {

useEffect(() => {
    Alert.alert(
        'Thank you for taking the time to test 21Things (beta)! We are excited to receive your valuable input.',
        'If this is your first time playing 21Things please review the help page before proceeding',
        [
            { text: 'Skip'},
            { text: 'Help page', onPress: () => setToggleHelp(true)},
        ],
        { cancelable: true }
    )
}, [])



    return (
      <View>
      </View>
    )
}

export default BetaAlert
