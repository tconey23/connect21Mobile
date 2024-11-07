import { StyleSheet, Text, View,  ScrollView  } from 'react-native'
import {useEffect, useState} from 'react'
import Selection from './Selection'

const SelectionDisplay = ({selections}) => {



  return (
    <ScrollView>
        <View style={styles.scrollContainer}>

      {selections && selections.map((sel, i) => (
          <Selection key={i} sel={sel}/>
        ))}
        </View>
    </ScrollView>
  )
}

export default SelectionDisplay

const styles = StyleSheet.create({
    scrollContainer: {
        width: 400,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
})