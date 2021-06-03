import React, {useEffect, useState} from 'react';
import {NavigationEvents} from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Linking,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import MasjidScreen from './MasjidScreen';
import {NavigationContainer} from '@react-navigation/native';

const ListItemScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDetails = async () => {
    const querySnap = await firestore().collection('ads').get();

    const result = querySnap.docs.map(docSnap => docSnap.data());

    setItems(result);
  };

  const openDial = phone => {
    console.log(phone);
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${phone}`);
    } else {
      Linking.openURL(`telprompt:${phone}`);
    }
  };

  useEffect(() => {
    getDetails();
  }, [isFocused]);

  const handlePostClick = item => {
    console.log(item);
    if (item.postType == 'Others') {
      navigation.navigate('listpostscreen', {item});
    }
    navigation.navigate('masjidScreen', {item});
  };

  const renderItem = item => {
    return (
      <TouchableOpacity onPress={() => handlePostClick(item)}>
        <View>
          <Card style={styles.card}>
            <Card.Title title={item.name} />
            <Card.Content>
              <Paragraph>{item.desc}</Paragraph>
              <Paragraph>{item.year}</Paragraph>
            </Card.Content>
            <Card.Actions>
              {/* <Button>{item.price}</Button> */}
              <Button onPress={() => openDial(item.phone)}>call </Button>
            </Card.Actions>
          </Card>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList
        data={items.reverse()}
        keyExtractor={item => item.phone}
        renderItem={({item}) => renderItem(item)}
        onRefresh={() => {
          setLoading(true);
          getDetails();
          setLoading(false);
        }}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    elevation: 2,
  },
});
export default ListItemScreen;
