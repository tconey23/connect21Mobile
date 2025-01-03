import React, { useEffect, useState } from 'react'
import { Text, View, Modal, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Platform, Pressable } from 'react-native'
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

const { width, height } = Dimensions.get('window');

const RefreshSvg = ({size}) =>{
    return(
    <Svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M7.37756 11.6296H6.62756H7.37756ZM7.37756 12.5556L6.81609 13.0528C6.95137 13.2056 7.14306 13.2966 7.34695 13.3049C7.55084 13.3133 7.74932 13.2382 7.89662 13.0969L7.37756 12.5556ZM9.51905 11.5414C9.81805 11.2547 9.82804 10.7799 9.54137 10.4809C9.2547 10.182 8.77994 10.172 8.48095 10.4586L9.51905 11.5414ZM6.56148 10.5028C6.28686 10.1927 5.81286 10.1639 5.50277 10.4385C5.19267 10.7131 5.16391 11.1871 5.43852 11.4972L6.56148 10.5028ZM14.9317 9.0093C15.213 9.31337 15.6875 9.33184 15.9915 9.05055C16.2956 8.76927 16.3141 8.29476 16.0328 7.9907L14.9317 9.0093ZM12.0437 6.25C9.05802 6.25 6.62756 8.653 6.62756 11.6296H8.12756C8.12756 9.49251 9.87531 7.75 12.0437 7.75V6.25ZM6.62756 11.6296L6.62756 12.5556H8.12756L8.12756 11.6296H6.62756ZM7.89662 13.0969L9.51905 11.5414L8.48095 10.4586L6.85851 12.0142L7.89662 13.0969ZM7.93904 12.0583L6.56148 10.5028L5.43852 11.4972L6.81609 13.0528L7.93904 12.0583ZM16.0328 7.9907C15.0431 6.9209 13.6212 6.25 12.0437 6.25V7.75C13.1879 7.75 14.2154 8.23504 14.9317 9.0093L16.0328 7.9907Z" fill="#1C274C"/>
        <Path d="M16.6188 11.4443L17.1795 10.9462C17.044 10.7937 16.8523 10.703 16.6485 10.6949C16.4447 10.6868 16.2464 10.7621 16.0993 10.9034L16.6188 11.4443ZM14.4805 12.4581C14.1817 12.745 14.1722 13.2198 14.4591 13.5185C14.746 13.8173 15.2208 13.8269 15.5195 13.54L14.4805 12.4581ZM17.4393 13.4972C17.7144 13.8068 18.1885 13.8348 18.4981 13.5597C18.8078 13.2846 18.8358 12.8106 18.5607 12.5009L17.4393 13.4972ZM9.04688 15.0047C8.76342 14.7027 8.28879 14.6876 7.98675 14.9711C7.68472 15.2545 7.66966 15.7292 7.95312 16.0312L9.04688 15.0047ZM11.9348 17.7499C14.9276 17.7499 17.3688 15.3496 17.3688 12.3703H15.8688C15.8688 14.5047 14.1158 16.2499 11.9348 16.2499V17.7499ZM17.3688 12.3703V11.4443H15.8688V12.3703H17.3688ZM16.0993 10.9034L14.4805 12.4581L15.5195 13.54L17.1383 11.9853L16.0993 10.9034ZM16.0581 11.9425L17.4393 13.4972L18.5607 12.5009L17.1795 10.9462L16.0581 11.9425ZM7.95312 16.0312C8.94543 17.0885 10.3635 17.7499 11.9348 17.7499V16.2499C10.792 16.2499 9.76546 15.7704 9.04688 15.0047L7.95312 16.0312Z" fill="#1C274C"/>
        <Path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
    </Svg>
    )
}

const HelpPage = ({setToggleHelp, toggleHelp}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [purple] = useState('#c956ff')

    useEffect(() => {
        if(toggleHelp){
            setModalVisible(true)
        } else {setToggleHelp(false)}
    },  [toggleHelp])

    const handleToggleHelp = () => {
        console.log(toggleHelp)
      setToggleHelp(false)
      setModalVisible(prev => !prev)
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
            <Text style={styles.headerText}>21Things Beta</Text>
            <Text style={styles.headerText}>Help</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }} style={{ flex: 1 }}>
            <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
                        21Things is a mood-boosting mobile app that 
                        guides users through a fun and reflective 
                        experience. 
                    </Text>
                    <Text style={styles.descriptionText}>
                        Starting with 21 prompts, users select 6 that 
                        resonate with them the most. 
                        They then narrow down their choices to a top 3, 
                        ultimately choosing a single favorite.
                    </Text>
                    <Text style={styles.descriptionText}>
                        Once a favorite is selected, 
                        users can write a personal note about it.
                    </Text>
                    <Text style={styles.descriptionText}>
                        This list – including the top 6, top 3, 
                        favorite prompt, and any written reflections – 
                        can be shared with another player or players, creating an 
                        interactive and uplifting way to connect with 
                        others!
                    </Text>
                    <Text style={styles.descriptionText}>
                        This version of 21Things is in the beta testing phase.
                    </Text>
                    <Text style={styles.descriptionText}>
                        In alpha, users will be allowed to play the game once per day.
                        However in the interest of gathering as much feedback as possible, 
                        users are provided the option to reset the game as many times as they wish
                        by tapping the
                        <View 
                            style={{
                                justifyContent: 'center', 
                                alignItems: 'flex-end',
                                alignSelf: 'center',
                                height: 10,
                                paddingHorizontal: 5
                            }}
                        >
                            <RefreshSvg size={20}/>
                        </View>
                        icon when prompted.
                    </Text>
                    <Text style={styles.descriptionText}>
                       Please be sure to follow the in-app feedback prompt, and let us know what you think!
                    </Text>
                    <Text style={styles.descriptionText}>
                       Thank you again for your time and effort! We truly appreciate it.
                    </Text>
                <View style={{ paddingVertical: 20, zIndex: 1 }}>
                    {Platform.OS === 'ios' ? 
                        <TouchableOpacity 
                            onPress={() => handleToggleHelp()}
                            style={{
                                alignSelf: 'center',
                                backgroundColor: purple,
                                width: 100,
                                paddingVertical: 10,
                                paddingHorizontal: 5,
                                borderRadius: 10,
                            }}
                        >
                            <Text style={{ textAlign: 'center', color: 'white' }}>
                                LET'S BEGIN!
                            </Text>
                        </TouchableOpacity>
                    :
                        <TouchableOpacity
                            onPress={() => handleToggleHelp()}
                            style={{
                                alignSelf: 'center',
                                backgroundColor: purple,
                                width: 100,
                                paddingVertical: 10,
                                paddingHorizontal: 5,
                                borderRadius: 10,
                                elevation: 20
                            }}
                        >
                            <Text style={{ textAlign: 'center', color: 'white' }}>
                                LET'S BEGIN!
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </ScrollView>
    </View>
</Modal>
    )
}

export default HelpPage

const styles = StyleSheet.create({
    pageContainer: {
        width: width,
        height: height,
        color: 'black'
    },
    headerText: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'Fredoka',
        color: 'black'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    descriptionText: {
        paddingVertical: 10,
        textAlign: 'center',
        color: 'black'
    },
    descriptionContainer: {
        padding: 20,
    }
});

