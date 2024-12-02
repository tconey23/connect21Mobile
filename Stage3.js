import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Selection from './Selection';

const { width } = Dimensions.get('window');

const Stage3 = ({ options, setSelectionCount, currentStage, setPrompts, setSelectionLimit, saveDatePlayed, share }) => {
  const viewRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [textLength, setTextLength] = useState(0);
  const [favorite, setFavorite] = useState('this');
  const [userText, setUserText] = useState('');
  const [scale, setScale] = useState(0.85)

  useEffect(() => {
    if (options) {
      let fav = options.find((opt) => opt.stage === 3);
      setFavorite(fav);
    }
  }, [options]);

  const takeScreenshotAndShare = async () => {
    if (!viewRef.current) {
      console.warn('View reference is not set');
      return;
    }

    try {
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 0.8,
        width: width * scale, // Adjust width to include scaling
        height: contentHeight * scale, // Adjust height to include scaling
      });

      const filePath = `${RNFS.DocumentDirectoryPath}/${Date.now()}_screenshot.png`;
      await RNFS.copyFile(uri, filePath);

      await Share.open({
        title: 'Share screenshot',
        url: `file://${filePath}`,
        failOnCancel: false,
      });

      await RNFS.unlink(filePath);
      setScale(1)
      saveDatePlayed();
    } catch (error) {
      console.error('Error taking screenshot and sharing:', error);
    }
  };

  useEffect(() => {
    if (share) {
      setScale(0.75)
      takeScreenshotAndShare();
    }
  }, [share]);

  const handleTextLength = (text) => {
    setTextLength(text.length);
    setUserText(text);
  };

  return (
    <View
      style={[{
        height: '90%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        transform: [{ scale }]
      }]}
    >
      <View
        ref={viewRef}
        style={[
          styles.screenshot,
          {
            transform: [{ scale }], // Apply scaling
          },
        ]}
      >
        <ScrollView
          onContentSizeChange={(w, h) => setContentHeight(h)} // Track total content height
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 40 }}>
            {options &&
              favorite &&
              options
                .filter((opt) => (currentStage === 0 ? opt : opt.stage >= 1))
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
          <View style={{ width: '100%', marginTop: -40 }}>
            <Text style={{ backgroundColor: 'green', width: (width * textLength) / 180 }}></Text>
            <Text style={{ marginTop: 0, textAlign: 'center' }}>{`${textLength}/180`}</Text>
          </View>
          <View style={styles.textInput}>
            <TextInput
              multiline
              placeholder={`Write something about '${favorite.title}'`}
              autoFocus={false}
              style={{ maxWidth: '85%', color: 'black', height: 'auto' }}
              maxLength={180}
              onChangeText={(text) => handleTextLength(text)}
            />
          </View>
        </ScrollView>
      </View>
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
    backgroundColor: 'white',
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
    marginBottom: 0,
  },
});
