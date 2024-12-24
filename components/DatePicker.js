import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import {useEffect, useState} from 'react'
import {Icon} from '@rneui/themed'

const { width, height } = Dimensions.get('window');

export default function DatePicker({categoryName, author, setGameDate, gameDate}) {
    const [currentDate, setCurrentDate] = useState()
    const [earliestDate, setEarliestDate] = useState()
    const [todaysDate, setTodaysDate] = useState()

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }).format(new Date(date));
    }

    const setEarliest = () => {
        const date = '12/01/2024'
        const [month, day, year] = date.split('/').map(Number)
        const parsedDate = new Date(year, month - 1, day)

        const formatDay = formatDate(new Date(parsedDate))
        setEarliestDate(formatDay)
    }

    // const setToday = () => {
    //     console.log(categoryName)
    //     const [month, day, year] = categoryName.split('/').map(Number)
    //     const parsedDate = new Date(year, month - 1, day)

    //     const formatDay = formatDate(new Date(parsedDate))
    //     setTodaysDate(formatDay)
    // }

    useEffect(() => {
        if(gameDate){
            setCurrentDate(gameDate)
            setEarliest()
        } else if(categoryName){
            setCurrentDate(categoryName) 
            setEarliest()
        }
    }, [gameDate, categoryName])

    useEffect(() => {
        setTodaysDate(formatDate(Date.now()))
    }, [])

    const handleSelectDate = (dir) => {
        const [month, day, year] = currentDate.split('/').map(Number) 

        let parsedDate

        if(dir === 'PREV') {
            parsedDate = new Date(year, month - 1, day -1)
        } else if(dir === 'NEXT') {
            parsedDate = new Date(year, month - 1, day +1)
        }

          setGameDate(formatDate(new Date(parsedDate)))
    }


  return (
    <View style={styles.categoryWrapper}>
        {todaysDate && 
            <>
                <TouchableOpacity style={[styles.buttons, {opacity: currentDate === earliestDate ? 0.5 : 1, backgroundColor: currentDate === earliestDate ? 'grey' :'#D32AF5', marginLeft: 40}]} disabled={currentDate === earliestDate} onPress={() => handleSelectDate('PREV')}>
                    <View flexDirection='row' justifyContent='center' alignItems='center'>
                        <Icon
                            name="left"
                            type="ant-design"
                            color="black"
                            size={24}
                            iconStyle={{ fontFamily: 'AntDesign', color: 'black' }}
                        />
                        <Text 
                            style={
                                {
                                    color: 'black'
                                }
                            }>
                            PREV
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '55%'}}>
                    <Text style={styles.catText}>{categoryName}</Text>
                    <Text style={[styles.catText, { fontSize: 18 }]}>{`Created by:`}</Text>
                    <Text style={[styles.catText, { fontSize: 18 }]}>{`${author}`}</Text>
                </View>
                <TouchableOpacity style={[styles.buttons, {opacity: currentDate === todaysDate ? 0.5 : 1, backgroundColor: currentDate === todaysDate ? 'grey' :'#D32AF5', marginRight: 40}]} disabled={currentDate === todaysDate} onPress={() => handleSelectDate('NEXT')}>
                        <View flexDirection='row' justifyContent='center' alignItems='center'>
                            <Text 
                                style={
                                    {
                                        color: 'black'
                                    }
                                }>
                                NEXT
                            </Text>
                            <Icon
                                name="right"
                                type="ant-design"
                                color="black"
                                size={24}
                                iconStyle={{ fontFamily: 'AntDesign', color: 'black' }}
                            />
                        </View>
                </TouchableOpacity>
            </>
        }
    </View>
  )
}

const styles = StyleSheet.create({
    catText: {
        fontSize: 30,
        width: '100%',
        textAlign: 'center',
        color: 'black'
      },
      categoryWrapper: {
        backgroundColor: 'white',
        height: height * 0.1,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        marginTop: -80,
      },
      buttons: {
        width: '20%',
        borderRadius: 15,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
      }
})