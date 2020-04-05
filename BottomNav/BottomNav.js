import * as React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors.js';
import Home from '../Home/Home';
import Health from '../Health/Health';
import Resources from '../Resources/Resources';

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: colors.PURPLE_50,
        inactiveTintColor: colors.GRAY_50,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Icon name="home" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={Health}
        options={{
          tabBarLabel: 'Health',
          tabBarIcon: ({color}) => (
            <Icon name="heart-outline" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Resources"
        component={Resources}
        options={{
          tabBarLabel: 'Resources',
          tabBarIcon: ({color}) => (
            <Icon name="file-document-box-outline" color={color} size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function BottomNav() {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}
