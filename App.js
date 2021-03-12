import { NavigationContainer, StackActions } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'

import { Home, Restaurant, OrderDelivery } from './screens'

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigater
        screenOptions={{
          headerShown: false
        }}
        initialRouteName={"Home"}
      >
        <StackScreeen name="Home" Component={Home} />
        <StackScreeen name="Restaurant" Component={Restaurant} />
        <StackScreeen name="OrderDelivery" Component={OrderDelivery} />
      </Stack.Navigater>
    </NavigationContainer>

  )
}
export default App;
