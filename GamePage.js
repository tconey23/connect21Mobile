import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { PixelRatio } from 'react-native';
import Stage from './Stage';
import Hexagon from './Hexagon';
import Stage3 from './Stage3';

const fontSize = PixelRatio.getFontScale() * 25;
const { width, height } = Dimensions.get('window')

const GamePage = ({ setPrompts, setStartGame, prompts, saveDatePlayed }) => {

  const [selectionCount, setSelectionCount] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [selectionLimit, setSelectionLimit] = useState(6);
  const [hexagons, setHexagons] = useState([])
  const [purple] = useState('#c956ff')
  const [share, setShare] = useState(false)

  useEffect(() => {
    setSelectionCount(0);
  }, []);

  useEffect(() => {
    let hexArray = []

    for(let i = 0; i < selectionLimit - selectionCount; i++){
      hexArray.push(<Hexagon key={i + Date.now()} currentStage={currentStage}/>)
    }

    for(let i = 0; i < selectionCount; i++){
      hexArray.push(<Hexagon key={i} currentStage={currentStage} state={true}/>)
    }

    setHexagons(hexArray)
  }, [selectionLimit, selectionCount, currentStage])

  const handleBack = () => {
    currentStage > 0 ? setCurrentStage((prev) => prev - 1) : setStartGame(false)
  }

  return (
    <View style={styles.container}>
      {currentStage === 0 && <Text style={styles.headerText}>Select the 6 that most boost your mood!</Text>}
      {currentStage === 1 && <Text style={styles.headerText}>Choose your Trifecta!</Text>}
      {currentStage === 2 && <Text style={styles.headerText}>And your mood-boostiest?!</Text>}
      {currentStage < 3 && <View style={{flexDirection: 'row-reverse'}}>{hexagons}</View>} 
      {currentStage < 3 ? 
          <Stage
              key={currentStage}
              options={prompts}
              setSelectionCount={setSelectionCount}
              selectionCount={selectionCount}
              currentStage={currentStage}
              setPrompts={setPrompts}
              setSelectionLimit={setSelectionLimit}
              selectionLimit={selectionLimit}
          />
          : 
          <Stage3 
            options={prompts}
            setSelectionCount={setSelectionCount}
            currentStage={currentStage}
            setPrompts={setPrompts}
            setSelectionLimit={setSelectionLimit}
            saveDatePlayed={saveDatePlayed}
            share={share}
          />
        }
      <View style={styles.buttonContainer}>
        {currentStage !== 3 &&<TouchableOpacity
          style={[styles.button, {backgroundColor: purple}]}
          onPress={() =>
            handleBack()
          }
        >
          <Text style={styles.text}>BACK</Text>
        </TouchableOpacity>}

        {selectionLimit === selectionCount && currentStage !== 3 &&(
          <TouchableOpacity
          style={[styles.button, {backgroundColor: purple}]}
            onPress={() => setCurrentStage((prev) => prev + 1)}
          >
            <Text style={styles.text}>NEXT</Text>
          </TouchableOpacity>
        )}

        {currentStage === 3 &&
        <>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: purple}]}
          onPress={() =>
            handleBack()
          }
        >
          <Text style={styles.text}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: purple}]} onPress={() => setShare(true)}>
          <Text style={styles.buttonText}>SHARE</Text> 
        </TouchableOpacity>
        </>
        }
      </View>
    </View>
  );
};

export default GamePage;

const styles = StyleSheet.create({
  container: {
    height: '98%',
    width: width,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingVertical: 15
  },
  headerText: {
    fontSize: 20,
    paddingVertical: 12.5,
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
  text: {
    fontFamily: 'Fredoka',
    fontWeight: '900'
  }
});