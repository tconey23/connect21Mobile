import React, { useRef } from 'react';
import { View, ScrollView,Text, TextInput, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Selection from './Selection';


const { width, height } = Dimensions.get('window');

const Stage3 = ({ setStartGame, canSelect, selectionLimit, setSelectionCount, onSelection, stageSelections, currentStage, selectionCount }) => {
  const viewRef = useRef(null);

  const takeScreenshotAndShare = async () => {
    if (!viewRef.current) {
      console.warn('View reference is not set');
      return;
    } else {
      console.log(viewRef.current)
    }
    try {
      // Capture the screenshot
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 0.8,
      });
  
      // Save the screenshot to the device's file system
      const filePath = `${RNFS.DocumentDirectoryPath}/${Date.now()}_screenshot.png`;
      await RNFS.copyFile(uri, filePath);
  
      // Share the file using react-native-share
      await Share.open({
        title: 'Share screenshot',
        url: `file://${filePath}`,
        failOnCancel: false,
      });
  
      // Delete the temporary screenshot file from the file system
      await RNFS.unlink(filePath);
  
      // Optional: reset or close the game screen after sharing
      // setStartGame(false);
    } catch (error) {
      console.error('Error taking screenshot and sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
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
              />
            ))}
          </View>
        <View style={styles.textInput}>
          <TextInput
            multiline
            placeholder={`Write something about '${stageSelections[2]}'`}
            autoFocus={false}
            style={{ maxWidth: '85%' }}
          />
      </View>
        </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takeScreenshotAndShare}>
          <Text style={styles.buttonText}>SHARE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setStartGame(false)}>
          <Text style={styles.buttonText}>DONE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Stage3;

const styles = StyleSheet.create({
  container: {
    height: height * .90,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: width,
    paddingVertical: 0,
  },
  screenshot: {
    height: height * .80,
    width: width,
  },
  button: {
    backgroundColor: 'lightblue',
    borderRadius: 5,
    marginHorizontal: 10,
    width: 100,
    height: 50,
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    marginTop: 20,
    flexDirection: 'row'
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
    marginTop: 15,
    marginBottom: -10,
  },
  buttonText: {
    color:  'black',
    fontFamily: 'Fredoka',
    fontWeight: '600',
    textAlign: 'center',

  },
});