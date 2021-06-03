import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';

const AccountScreen = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDetails = async () => {
    const querySnap = await firestore()
      .collection('ads')
      .where('owner', '==', auth().currentUser.uid)
      .get();
    const result = querySnap.docs.map(docSnap => docSnap.data());
    console.log(result);
    setItems(result);
  };
  useEffect(() => {
    console.log('in get Details');
    getDetails();
    return () => {
      console.log('cleanup');
    };
  }, []);

  const handlePostClick = item => {
    console.log(item);
    if (item.postType == 'Others') {
      navigation.navigate('listpostscreen', {item});
    }
    navigation.navigate('masjidScreen', {item});
  };
  const renderItem = item => {
    console.log(item);
    return (
      <TouchableOpacity onPress={() => handlePostClick(item)}>
        <View>
          <Card style={styles.card}>
            <Card.Title title={item.name} />
            <Card.Content>
              <Paragraph>{item.desc}</Paragraph>
              <Paragraph>{item.year}</Paragraph>
            </Card.Content>
            <Card.Cover
              source={{uri: item.image ? item.image : ' '}}
              style={{display: item.image ? 'flex' : 'none'}}
            />
            <Card.Actions>
              <Button onPress={() => openDial}>call </Button>
            </Card.Actions>
          </Card>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: '20%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 22}}>{auth().currentUser.email}</Text>
        <Button mode="contained" onPress={() => auth().signOut()}>
          LogOut
        </Button>
        <Text style={{fontSize: 22}}>Your Ads!</Text>
      </View>
      <FlatList
        data={items}
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

export default AccountScreen;
