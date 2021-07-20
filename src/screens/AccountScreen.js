import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Button, Card, Paragraph } from 'react-native-paper'
import { Icon } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import { TabView, SceneMap } from 'react-native-tab-view'

const AccountScreen = ({ navigation }) => {
  const [ownerItems, setOwnerItems] = useState([])
  const [memberItems, setMemberItems] = useState([])

  const [loading, setLoading] = useState(false)
  const [index, setIndex] = React.useState(0)

  // const data = [
  //   {
  //     value: `0`,
  //     label: `Owner`,
  //     checked: ownerItems,
  //   },
  //   {
  //     value: `1`,
  //     label: `Member`,
  //   },
  // ]

  const getDetails = async () => {
    const querySnap = await firestore()
      .collection(`ads`)

      .get()
    const userId = auth().currentUser.uid
    const result = querySnap.docs.map(docSnap => docSnap.data())
    const owner = []
    const member = []
    for (const item of result) {
      if (item.owner === userId) {
        owner.push(item)
      } else if (item.members?.includes(userId)) {
        member.push(item)
      }
    }
    setOwnerItems(owner)
    setMemberItems(member)
  }
  const layout = useWindowDimensions()
  useEffect(() => {
    getDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <TouchableOpacity style={tw`absolute z-20 top-4 right-1 h-16 w-10`}>
              <Icon
                name="more-vert"
                size={25}
                color="#057094"
                // onPress={() => dropdownclick}
              />
            </TouchableOpacity>
            <Card.Content>
              <Paragraph>{item.desc}</Paragraph>
            </Card.Content>
            <Card.Cover
              source={{ uri: item.image ? item.image : ` ` }}
              style={{ display: item.image ? `flex` : `none` }}
            />
            <Card.Actions>
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

  const MembersData = () => {
    return (
      <FlatList
        data={memberItems}
        keyExtractor={memberItems.id}
        renderItem={({ item }) => renderItem(item)}
        onRefresh={() => {
          setLoading(true)
          getDetails()
          setLoading(false)
        }}
        refreshing={loading}
      />
    )
  }

  const OwnerData = () => {
    return (
      <FlatList
        data={ownerItems}
        keyExtractor={ownerItems.id}
        renderItem={({ item }) => renderItem(item)}
        onRefresh={() => {
          setLoading(true)
          getDetails()
          setLoading(false)
        }}
        refreshing={loading}
      />
    )
  }

  const [routes] = React.useState([
    { key: `first`, title: `Owner` },
    { key: `second`, title: `Member` },
  ])
  const renderScene = SceneMap({
    first: OwnerData,
    second: MembersData,
  })
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: `12%`,
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
      {/* <ChonseSelect
          height={35}
          style={{ marginLeft: 20, marginBottom: 10 }}
          data={data}
          initValue={`0`}
          onPress={item => this.setState({ gender: item.value })}
        > */}

      <TabView
        style={tw`mt-5`}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
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
