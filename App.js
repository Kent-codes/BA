import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Restaurant, OrderDelivery } from './screens';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigater
        screenOptions={{
          headerShown: false
        }}
        initialRouteName={"Home"}
      >
        <Stack.Screen name="Home" Component={Home} />
        <Stack.Screen name="Restaurant" Component={Restaurant} />
        <Stack.Screen name="OrderDelivery" Component={OrderDelivery} />
      </Stack.Navigater>
    </NavigationContainer>

  )
}


