import { Text, View, Modal, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Platform, Pressable, Touchable, TextInput } from 'react-native'
import { useState, useEffect, useRef } from 'react';
const { width, height } = Dimensions.get('window');

const AccountInfo = ({toggleAccount, setToggleAccount, displayName, resetDisplayName, devProd}) => { 

    const [modalVisible, setModalVisible] = useState(false)
    const [toggleCreateAccount, setToggleCreateAccount] = useState(false)
    const [authenticationData, setAuthenticationData] = useState({
        email: null,
        password: null,
        displayName: null,
        phoneNumber: null,
      })

    useEffect(() => {
        toggleAccount ? setModalVisible(true) : setModalVisible(false)
    }, [toggleAccount])

    useEffect(() => {
        console.log(authenticationData)
    }, [authenticationData])

    const handleUpdateAccount = (field, value) => {

        setAuthenticationData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleCreateAccount = async () => { 
        const endpoint = devProd === 'dev'
            ? 'https://secure-beach-74758-ab0619edd0f3.herokuapp.com'
            : 'http://10.0.0.155:5001';
    
        try {
            const res = await fetch(`${endpoint}/api/users/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authenticationData),
            });
    
            if (!res.ok) {
                throw new Error(`Server responded with status ${res.status}`);
            }
    
            const data = await res.json();
    
            if (data) {
                console.log('Response Data:', data);
                return Object.keys(data);
            }
        } catch (error) { 
            console.error('Error creating user:', error);   
        }
    };
    

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
        <View style={{width: '100%', justifyContent: 'center', alignItems: 'flex-start', padding: 20, color: 'black'}}>
            <Text style={{ width: '75%', paddingBottom: 1, paddingTop: 3, color: 'black' }}>Update Username</Text>
            <TextInput
                onChangeText={(text) => handleUpdateAccount('displayName', text)}
                value={authenticationData.displayName || ''}
                style={styles.textInput}
                placeholder={displayName}
                placeholderTextColor={'grey'}
            />

            <Text style={{ width: '75%', paddingBottom: 1, paddingTop: 3, color: 'black' }}>Email Address</Text>
            <TextInput
                onChangeText={(text) => handleUpdateAccount('email', text)}
                value={authenticationData.email || ''}
                style={styles.textInput}
                placeholder={'email address'}
                placeholderTextColor={'grey'}
            />

            <Text style={{ width: '75%', paddingBottom: 1, paddingTop: 3, color: 'black' }}>Create Password</Text>
            <TextInput
                onChangeText={(text) => handleUpdateAccount('password', text)}
                value={authenticationData.password || ''}
                style={styles.textInput}
                placeholder={'password'}
                placeholderTextColor={'grey'}
                secureTextEntry
            />

            <Text style={{ width: '75%', paddingBottom: 1, paddingTop: 3, color: 'black' }}>Confirm Password</Text>
            <TextInput
                onChangeText={(text) => handleUpdateAccount('confirmPassword', text)}
                value={authenticationData.confirmPassword || ''}
                style={styles.textInput}
                placeholder={'password'}
                placeholderTextColor={'grey'}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={() => handleCreateAccount()}><Text>Create</Text></TouchableOpacity>
        </View>        
    }

        <TouchableOpacity style={styles.button} onPress={() => handleCreateAccount(false)}><Text>Close</Text></TouchableOpacity>
        </View>
    </View>
</Modal>
  )
}


const styles = StyleSheet.create({
    pageContainer: {
        width: width,
        height: height,
        color: 'black',
    },
    headerText: {
        textAlign: 'center',
        fontSize: 15,
        fontFamily: 'Fredoka',
        color: 'black'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
        color: 'black'
    },
    descriptionText: {
        paddingVertical: 10,
        textAlign: 'center',
        color: 'black'
    },
    descriptionContainer: {
        padding: 20,
        color: 'black',
    },
    textInput: {
        height: 50,
        width: '75%',
        backgroundColor: 'white',
        paddingHorizontal: 6,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 10,
        elevation: 10,
        alignItems: 'center',
        color: 'black',
        marginBottom: 0,
      },
      button: {
        backgroundColor: '#127ad3',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 25,
        marginVertical: 5,
        elevation: 30,
        color: 'black'
      },
      buttonContainer: {
        flexDirection: 'row',
        height: 'fit-content',
        marginTop: 10,
        marginBottom: 20,
        color: 'black'
      },
});

export default AccountInfo