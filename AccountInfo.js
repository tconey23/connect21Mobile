import { Text, View, Modal, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Platform, Pressable, Touchable, TextInput } from 'react-native'
import { useState, useEffect, useRef } from 'react';
const { width, height } = Dimensions.get('window');

const AccountInfo = ({toggleAccount, setToggleAccount, displayName, resetDisplayName}) => { 

    const [modalVisible, setModalVisible] = useState(false)
    const [toggleCreateAccount, setToggleCreateAccount] = useState(false)

    useEffect(() => {
        toggleAccount ? setModalVisible(true) : setModalVisible(false)
    }, [toggleAccount])

    const handleCreateAccount = async () => { 

    }

  return (
    <Modal 
    animationType="slide"
    transparent={Platform.OS === 'ios'}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
    >
    <View style={[styles.pageContainer, { backgroundColor: Platform.OS === 'android' ? 'white' : 'white' }]}> 
        <View style={styles.header}>
            <Text key={displayName} style={styles.headerText}>{`Welcome ${displayName}`}</Text>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => resetDisplayName()}><Text>Refresh Username</Text></TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity style={styles.button} onPress={() => setToggleCreateAccount(prev => !prev)}><Text>Create Account</Text></TouchableOpacity>
    {toggleCreateAccount &&
        <View>
            <Text>Update user name</Text>
            <TextInput key={displayName} style={styles.textInput} placeholder={displayName} placeholderTextColor={'grey'}></TextInput>

            <Text>Create Password</Text>
            <TextInput key={displayName} style={styles.textInput} placeholder={'password'} placeholderTextColor={'grey'}></TextInput>

            <Text>Confirm Password</Text>
            <TextInput key={displayName} style={styles.textInput} placeholder={'password'} placeholderTextColor={'grey'}></TextInput>

            <TouchableOpacity style={styles.button} onPress={() => handleCreateAccount()}><Text>Create</Text></TouchableOpacity>
        </View>        
    }

        <TouchableOpacity style={styles.button} onPress={() => setToggleAccount(false)}><Text>Close</Text></TouchableOpacity>
        </View>
    </View>
</Modal>
  )
}


const styles = StyleSheet.create({
    pageContainer: {
        width: width,
        height: height,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 15,
        fontFamily: 'Fredoka',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    descriptionText: {
        paddingVertical: 10,
        textAlign: 'center',
    },
    descriptionContainer: {
        padding: 20,
    },
    textInput: {
        height: 50,
        backgroundColor: 'white',
        paddingHorizontal: 0,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 10,
        elevation: 10,
        width: width,
        alignItems: 'center',
        color: 'black',
        marginBottom: 0,
      },
      button: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 25,
        elevation: 30,
      },
      buttonContainer: {
        flexDirection: 'row',
        height: 'fit-content',
        marginTop: 10,
        marginBottom: 20
      },
});

export default AccountInfo