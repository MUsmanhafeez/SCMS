import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper'
import OptionsMenu from 'react-native-option-menu'
const MoreIcon = require(`../../assets/more/more.png`)

const AccountScreen = ({ navigation }) => {

  const myIcon = (<Icon name="rocket" size={30} color="#900" />)
<OptionsMenu
  customButton={myIcon}
  destructiveIndex={1}
  options={["Edit", "Delete", "Cancel"]}
  actions={[editPost,deletePost]}/>

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const getDetails = async () => {
    const querySnap = await firestore()
      .collection(`ads`)
      .where(`owner`, `==`, auth().currentUser.uid)
      .get()
    const result = querySnap.docs.map(docSnap => docSnap.data())
    setItems(result)
  }
  useEffect(() => {
    getDetails()
  }, [])
  const openDial = phone => {
    // eslint-disable-next-line no-undef
    if (Platform.OS === `android`) {
      Linking.openURL(`tel:${phone}`)
    } else {
      Linking.openURL(`telprompt:${phone}`)
    }
  }

  const handlePostClick = item => {
    if (item.postType === `Others`) {
      navigation.navigate(`listPostScreen`, { item })
    } else {
      navigation.navigate(`masjidScreen`, { item })
    }
  }
  const renderItem = item => {
    return (
      <TouchableOpacity onPress={() => handlePostClick(item)}>
        <View>
          <Card style={styles.card}>
            <Card.Title title={item.name} />
            <Card.Content>
              <Paragraph>{item.desc}</Paragraph>
            </Card.Content>
            <Card.Cover
              source={{ uri: item.image ? item.image : ` ` }}
              style={{ display: item.image ? `flex` : `none` }}
            />
            <Card.Actions>
              <Button onPress={() => openDial(item.phone)}>call </Button>
              <View
                style={{
                  marginLeft: `auto`,
                }}
              >
                <Paragraph style={{ alignSelf: `flex-end` }}>
                  {item.createdAt &&
                    item.createdAt.toDate().toLocaleTimeString(`en-US`)}
                </Paragraph>
              </View>
            </Card.Actions>
          </Card>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: `20%`,
          justifyContent: `space-between`,
          alignItems: `center`,
        }}
      >
        <Text style={{ fontSize: 22 }}>{auth().currentUser.email}</Text>
        <Button mode="contained" onPress={() => auth().signOut()}>
          LogOut
        </Button>
        <Text style={{ fontSize: 22 }}>Your Ads!</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.phone}
        renderItem={({ item }) => renderItem(item)}
        onRefresh={() => {
          setLoading(true)
          getDetails()
          setLoading(false)
        }}
        refreshing={loading}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    elevation: 2,
  },
})

export default AccountScreen
