import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DisplayGame from './components/DisplayGame';
import { Icon } from '@rneui/base';

const { width, height } = Dimensions.get('window');

const Friends = ({ toggleFriends, setToggleFriends, userData, devProd, fetchUserData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [dates, setDates] = useState(null);
  const [games, setGames] = useState(null);
  const [viewGame, setViewGame] = useState(null);
  const [comment, setComment] = useState(null);
  const purple = '#c956ff';



  const resetAndClose = () => {
    setSelectedUser(null);
    setSelectedDate(null);
    setSelectedGame(null);
    setViewGame(null);
    setDates(null)
    setGames(null)
    setComment(null)
    setToggleFriends(false)
  }

  const fetchDynamicData = async (path, setStateCallback) => {
    setLoading(true);
    try {
      const res = await fetchUserData(path);
      setStateCallback(res);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameData = async (path) => {
    setLoading(true);
    let endpoint = devProd === 'dev'
      ? 'https://secure-beach-74758-ab0619edd0f3.herokuapp.com'
      : 'http://10.0.0.155:5001';

    try {
      const res = await fetch(`${endpoint}/api/getdbpath?path=${path}`);
      const data = await res.json();
      if (data) {
        setViewGame(Object.values(data).filter((d) => !d.userComment && d.stage !== 0));
        setComment(Object.values(data).find((d) => d.userComment));
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setModalVisible(toggleFriends);
  }, [toggleFriends]);

  useEffect(() => {
    if (selectedUser && !dates) {
      fetchDynamicData(`users/${selectedUser}/saved_games`, setDates);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedDate) {
      fetchDynamicData(`users/${selectedUser}/saved_games/${selectedDate}`, setGames);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedGame) {
      fetchGameData(`users/${selectedUser}/saved_games/${selectedDate}/${selectedGame}/gameData`);
    }
  }, [selectedGame]);

  const resetData = () => {
    if(viewGame){
        setViewGame(null)
        setSelectedGame(null)
        return
    } else if(selectedDate) {
        setSelectedDate(null)
        return
    } else if(selectedUser) {
        setDates(null)
        setSelectedUser(null)
        return
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={Platform.OS === 'ios'}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <ScrollView style={styles.pageContainer}>
        <TouchableOpacity>
          <Icon onPress={() => resetAndClose()} name='controller-fast-backward' type='entypo' />
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color={purple} style={styles.loader} />}

        {!selectedUser && userData && (
          <View>
            {userData.map((user, i) => (
                <TouchableOpacity key={user.id || `user-${i}`} style={styles.itemContainer} onPress={() => setSelectedUser(user)}>
                <Text style={styles.itemText}>{user}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedUser && (
            <View>
            <Icon onPress={() => resetData()} name='back' type='entypo' />
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>{selectedUser}</Text>
            </View>
            {dates && dates.map((date, i) => (
                <TouchableOpacity key={date.id || `date-${i}`} style={styles.itemContainer} onPress={() => setSelectedDate(date)}>
                <Text style={styles.itemText}>{date}</Text>
                {date === selectedDate && games && (
                    <View>
                    {games.map((game, j) => (
                        <TouchableOpacity
                        key={game.id || `game-${j}`}
                        style={styles.subItemContainer}
                        onPress={() => setSelectedGame(game)}
                        >
                        <Text style={styles.subItemText}>{game}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
        {selectedGame && viewGame && (
            <View>
            <Icon onPress={() => resetData()} name='back' type='entypo' />
            <Text style={styles.headerText}>{selectedUser}</Text>
            <Text style={styles.itemText}>{selectedDate}</Text>
            <Text style={styles.subItemText}>{selectedGame}</Text>
            <DisplayGame options={viewGame} comment={comment} />
          </View>
        )}
    </Modal>
  );
};

export default Friends;

const styles = StyleSheet.create({
  pageContainer: {
    width: width,
    height: height,
    backgroundColor: 'white',
    color: 'black'
  },
  loader: {
    marginTop: 20,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    color: 'black'
  },
  itemContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    color: 'black'
  },
  itemText: {
    fontSize: 16,
    color: 'black'
  },
  subItemContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#127ad3',
    borderRadius: 8,
    alignItems: 'center',
    color: 'black'
  },
  subItemText: {
    fontSize: 14,
  },
});
