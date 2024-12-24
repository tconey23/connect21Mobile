import { StyleSheet, Text, View, Dimensions, FlatList, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import DisplaySelection from './DisplaySelection';

const { width, height } = Dimensions.get('window');

const DisplayGame = ({ options, comment, fetchGameData }) => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);


  const listItem = ({ item }) => <DisplaySelection option={item} />;

  if (loading) {
    return <Text>Loading game data...</Text>;
  }

  return (
    <View style={styles.container}>
      {comment?.userComment?.text && <Text style={{color: 'black'}}>{comment.userComment.text}</Text>}
      <FlatList
        data={gameData ? gameData.options : options}
        renderItem={listItem}
        keyExtractor={(item, index) => item?.id || index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

export default DisplayGame;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: width,
    paddingVertical: 8,
    color: 'black'
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    color: 'black'
  },
});
