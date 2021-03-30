import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import Tabs from './navigation/tabs'
import { Home, Restaurant, RideMap } from './screens';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      {/* hide a header */}
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Home" component={Tabs} />
        <Stack.Screen name="Restaurant" component={Restaurant} />
        <Stack.Screen name="RideMap" component={RideMap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;