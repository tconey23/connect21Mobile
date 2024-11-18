import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView,Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, ProgressBarAndroidBase } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Selection from './Selection';


const { width, height } = Dimensions.get('window');

const Stage3 = ({ setPrompts, saveDatePlayed, canSelect, selectionLimit, setSelectionCount, onSelection, stageSelections, currentStage, selectionCount }) => {
  const viewRef = useRef(null);
  const textRef = useRef()
  const [purple] = useState('#c956ff')
  const [textLength, setTextLength] = useState(0)
  const [scroll, setScroll] = useState()

  const takeScreenshotAndShare = async () => {
    if (!viewRef.current) {
      console.warn('View reference is not set');
      return;
    } else {
      // console.log(viewRef.current)
    }
    try {
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 0.8,
      });
      const filePath = `${RNFS.DocumentDirectoryPath}/${Date.now()}_screenshot.png`;
      await RNFS.copyFile(uri, filePath);

      await Share.open({
        title: 'Share screenshot',
        url: `file://${filePath}`,
        failOnCancel: false,
      });
  
      await RNFS.unlink(filePath);
      saveDatePlayed()
    } catch (error) {
      console.error('Error taking screenshot and sharing:', error);
    }
  };

  const handleInputFocus = () => {
    if(viewRef.current){
      viewRef.current.scrollTo({ x: 0, y: 259, animated: true });
    }
  }

  const handleInputBlur = () => {
    if(viewRef.current){
      viewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  const handleTextLength = (text) => {
    setTextLength(text.length)
  }


 
  return (
    <View style={{height: '95%', width: width, flexDirection: 'column', justifyContent: 'flex-start'}}>
        <ScrollView ref={viewRef} style={styles.screenshot}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', height: '75%' }}>
            {stageSelections && stageSelections[0] && stageSelections[0].map((opt, i) => (
              <Selection
              key={i}
              option={opt}
              canSelect={canSelect}
              selectionLimit={selectionLimit}
              setSelectionCount={setSelectionCount}
              onSelection={onSelection}
              selected={stageSelections[currentStage].includes(opt)}
              selectionCount={selectionCount}
              stageSelections={stageSelections}
              currentStage={currentStage}
              setPrompts={setPrompts}
              />
            ))}
          </View>
          <View style={{width: '100%', marginTop: -40}}>
            <Text style={{backgroundColor: 'green', width: (width * textLength) / 180}}></Text>
            <Text style={{marginTop: 0, textAlign: 'center'}}>{`${textLength}/180`}</Text>
          </View>
        <View style={styles.textInput}>
          <TextInput
            multiline
            placeholder={`Write something about '${stageSelections[2]}'`}
            autoFocus={false}
            onFocus={() => handleInputFocus()}
            onBlur={() => handleInputBlur()}
            style={{ maxWidth: '85%', color: 'black', height: 'auto'}}
            maxLength={180}
            onChangeText={(text) => handleTextLength(text)}
            />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, {backgroundColor: purple}]} onPress={takeScreenshotAndShare}>
          <Text style={styles.buttonText}>SHARE</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
  </View>
  );
};

export default Stage3;

const styles = StyleSheet.create({
  container: {
    height: '95%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: width,
    paddingVertical: 8,
  },
  screenshot: {
    height: '100%',
    width: width,
  },
  button: {
    borderRadius: 5,
    marginHorizontal: 10,
    width: 100,
    height: 50,
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    flexDirection: 'row',
  },
  textInput: {
    height: 100,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    elevation: 10,
    width: width,
    alignItems: 'center',
    color: 'black',
    marginBottom: 10
  },
  buttonText: {
    color:  'black',
    fontFamily: 'Fredoka',
    fontWeight: '600',
    textAlign: 'center',

  },
});