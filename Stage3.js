import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView,Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, ProgressBarAndroidBase } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Selection from './Selection';


const { width, height } = Dimensions.get('window');

const Stage3 = ({ options, setSelectionCount, currentStage, setPrompts, setSelectionLimit, saveDatePlayed, share }) => {
  const viewRef = useRef(null);
  const [purple] = useState('#c956ff')
  const [textLength, setTextLength] = useState(0)
  const [favorite, setFavorite] = useState('this')
  const [userText, setUserText] = useState('')

  useEffect(() => {
    if(options){
      let fav = options.find((opt) => opt.stage === 3)
      setFavorite(fav)
    }
  }, [options])



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

  useEffect(() => {
    if(share){
      takeScreenshotAndShare()
    }
  }, [share])

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
    setUserText(text)
  }

  return (
    <View style={{height: '90%', width: width, flexDirection: 'column', justifyContent: 'flex-start', backgroundColor: 'white'}}>
        <ScrollView ref={viewRef} style={styles.screenshot}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 40}}>
          {options && favorite && 
          options
            .filter((opt) => currentStage === 0 ? opt : opt.stage >= 1)
            .sort((a, b) => {
              const stageA = a.stage ?? Infinity;
              const stageB = b.stage ?? Infinity;

              return stageA - stageB; 
            })
            .map((opt, i) => {
              if (i < 21) {
                return (
                  <Selection
                    key={`stage ${i}`}
                    currentStage={currentStage}
                    setSelectionCount={setSelectionCount}
                    option={opt}
                    options={options}
                    setPrompts={setPrompts}
                    setSelectionLimit={setSelectionLimit}
                  />
                );
              }
              return null;
            })}
          </View>
          {!share && 
          <View style={{width: '100%', marginTop: -40}}>
            <Text style={{backgroundColor: 'green', width: (width * textLength) / 180}}></Text>
            <Text style={{marginTop: 0, textAlign: 'center'}}>{`${textLength}/180`}</Text>
          </View>}
        <View style={styles.textInput}>
        {!share ?
        <TextInput
            multiline
            placeholder={`Write something about '${favorite.title}'`}
            autoFocus={false}
            onFocus={() => handleInputFocus()}
            onBlur={() => handleInputBlur()}
            style={{ maxWidth: '85%', color: 'black', height: 'auto'}}
            maxLength={180}
            onChangeText={(text) => handleTextLength(text)}
          />
          :
          <Text>{userText}</Text>}
      </View>
        </ScrollView>
  </View>
  );
};

export default Stage3;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: width,
    paddingVertical: 8,
  },
  screenshot: {
    height: '100%',
    width: width,
    backgroundColor: 'white'
  },
  textInput: {
    height: 100,
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
    marginBottom: 0
  },
  buttonText: {
    color:  'black',
    fontFamily: 'Fredoka',
    fontWeight: '600',
    textAlign: 'center',

  },
});