import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { PixelRatio } from 'react-native';
// import * as Font from 'expo-font';
import Stage from './Stage';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import Hexagon from './Hexagon';

const fontSize = PixelRatio.getFontScale() * 25;
const { width, height } = Dimensions.get('window')

const GamePage = ({ setStartGame }) => {
  const [stageSelections, setStageSelections] = useState({ 0: [], 1: [], 2: [], 3: [] }); // Store selections for each stage
  const [options, setOptions] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(true);
  const [selectionCount, setSelectionCount] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [selectionLimit, setSelectionLimit] = useState(6);
  const [canSelect, setCanSelect] = useState(true);
  const [hexagons, setHexagons] = useState([])
  const [purple] = useState('#c956ff')
  const [yellow] = useState('#fff200')
  const [green] = useState('#45d500')


  // const loadFonts = async () => {
  //   await Font.loadAsync({
  //     'Roboto': require('./assets/fonts/Roboto_Mono/RobotoMono-VariableFont_wght.ttf'),
  //     'Fredoka': require('./assets/fonts/Fredoka/static/Fredoka-Regular.ttf'),
  //   });
  //   setFontsLoaded(true);
  // };

  const fetchOptions = async () => {
    try {
      const res = await fetch('https://raw.githubusercontent.com/tconey23/connect21_be/refs/heads/main/ServerData/gptResp.json');
      const data = await res.json();
      const final = JSON.parse(data.choices[0].message.content);

      if (final) {
        setOptions(final);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  useEffect(() => {
    // loadFonts();
    setSelectionCount(0);
    fetchOptions();
  }, []);

  useEffect(() => {
    setHexagons([])
    if(currentStage === 3){
      setCanSelect(false)
    }
    setSelectionCount(0)
    switch (currentStage) {
      case 0:
        setSelectionLimit(6);
        setStageSelections({ 0: [], 1: [], 2: [], 3: [] })
        setCanSelect(true)
        break;
      case 1:
        setSelectionLimit(3);
        setStageSelections(prev => ({
          ...prev,
          1: [],
          2: [],
          3: []
        }))
        setCanSelect(true)
        break;
      case 2:
        setSelectionLimit(1);
        setStageSelections(prev => ({
          ...prev,
          2: [],
          3: []
        }))
        setCanSelect(true)
        break;
      case 3:
        setSelectionLimit(1);
        setStageSelections(prev => ({
          ...prev,
          3: []
        }))
        setCanSelect(true)
        break;
    }
  }, [currentStage]);

  useEffect(() => {
    let hexArray = []

    for(let i = 0; i < selectionLimit - selectionCount; i++){
      hexArray.push(<Hexagon currentStage={currentStage}/>)
    }

    for(let i = 0; i < selectionCount; i++){
      hexArray.push(<Hexagon currentStage={currentStage} state={true}/>)
    }

    setHexagons(hexArray)
  }, [selectionLimit, selectionCount])

  const handleSelection = (selectedOption) => {
    console.log(selectedOption)
    setStageSelections((prev) => {
      const updatedSelections = { ...prev };
      updatedSelections[currentStage] = [
        ...updatedSelections[currentStage],
        selectedOption,
      ];
      return updatedSelections;
    });
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 0:
        return (
          <Stage
            options={options}
            canSelect={canSelect}
            selectionLimit={selectionLimit}
            setSelectionCount={setSelectionCount}
            onSelection={handleSelection}
            currentStage={currentStage}
            stageSelections={stageSelections}
            selectionCount={selectionCount}
          />
        );
      case 1:
        return (
          <Stage1
          options={options}
          canSelect={canSelect}
          selectionLimit={selectionLimit}
          setSelectionCount={setSelectionCount}
          onSelection={handleSelection}
          currentStage={currentStage}
          stageSelections={stageSelections}
          selectionCount={selectionCount}
          />
        );
      case 2:
        return (
          <Stage2
          options={options}
          canSelect={canSelect}
          selectionLimit={selectionLimit}
          setSelectionCount={setSelectionCount}
          onSelection={handleSelection}
          currentStage={currentStage}
          stageSelections={stageSelections}
          selectionCount={selectionCount}
          />
        );
      case 3:
        return (
          <Stage3
          options={options}
          canSelect={canSelect}
          selectionLimit={selectionLimit}
          setSelectionCount={setSelectionCount}
          onSelection={handleSelection}
          currentStage={currentStage}
          stageSelections={stageSelections}
          selectionCount={selectionCount}
          setStartGame={setStartGame}
          />
        );
      default:
        return null;
    }
  };

  const handleBack = () => {
    currentStage > 0 ? setCurrentStage((prev) => prev - 1) : setStartGame(false)
  }

  return (
    <View style={styles.container}>
      {currentStage < 3 && <Text style={styles.headerText}>Select {selectionLimit} that boost{selectionLimit === 1 && 's'} your mood!</Text>}
      {currentStage < 3 && <View style={{flexDirection: 'row-reverse'}}>{hexagons}</View>}
      {fontsLoaded && renderCurrentStage()}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            handleBack()
          }
        >
          <Text style={styles.text}>BACK</Text>
        </TouchableOpacity>
        {selectionLimit === selectionCount && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentStage((prev) => prev + 1)}
          >
            <Text style={styles.text}>NEXT</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default GamePage;

const styles = StyleSheet.create({
  container: {
    height: height * .90,
    width: width,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    height: 40,
    marginTop: 40,
  },
  text: {
    fontFamily: 'Fredoka',
    fontWeight: '900'
  }
});