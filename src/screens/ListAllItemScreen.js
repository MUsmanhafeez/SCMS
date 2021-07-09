/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  Linking,
  TouchableOpacity,
  UIManager,
  findNodeHandle,
} from 'react-native'
import { Button, Card, Paragraph } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import { Icon } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'

const ListItemScreen = ({ navigation, route }) => {
  const isFocused = useIsFocused()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const getDetails = async () => {
    const querySnap = await firestore()
      .collection(`ads`)
      .get()

    const result = querySnap.docs.map(docSnap => docSnap.data())

    setItems(result)
  }

  const openDial = phone => {
    if (Platform.OS === `android`) {
      Linking.openURL(`tel:${phone}`)
    } else {
      Linking.openURL(`telprompt:${phone}`)
    }
  }

  useEffect(() => {
    getDetails()
  }, [])

  const handlePostClick = item => {
    if (item.postType === `Others`) {
      navigation.navigate(`listPostScreen`, { item })
    } else navigation.navigate(`masjidScreen`, { item })
  }

  const renderItem = item => {
    return (
      <TouchableOpacity onPress={() => handlePostClick(item)}>
        <View>
          <Card style={styles.card}>
            <Card.Title title={item.name} />
            <TouchableOpacity style={tw`absolute z-20 top-4 right-1 h-16 w-10`}>
              <Icon name="more-vert" size={25} color="#057094" />
            </TouchableOpacity>
            <Card.Content>
              <Paragraph>{item.desc}</Paragraph>
            </Card.Content>
            <Card.Cover
              source={{ uri: item.image ? item.image : ` ` }}
              style={{ display: item.image ? `flex` : `none` }}
            />
            <Card.Actions>
              {/* <Button>{item.price}</Button> */}
              <Button color={`#057094`} onPress={() => openDial(item.phone)}>
                call{` `}
              </Button>
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
    <View>
      <FlatList
        data={items.reverse()}
        keyExtractor={item => item.id}
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
export default ListItemScreen
