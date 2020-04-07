import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors.js';
import Home from '../Home/Home';
import HealthNav from '../Health/HealthNav';
import Resources from '../Resources/Resources';
import HomeContainer from '../Home/HomeContainer'

const ADD_DEBUG_SCREEN = __DEV__

const Tab = createBottomTabNavigator();

export default function BottomNav() {
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
        name="HealthNav"
        component={HealthNav}
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
    { ADD_DEBUG_SCREEN && 
      <Tab.Screen
        name="Debug"
        component={HomeContainer}
        options={{
          tabBarLabel: 'Debug',
          tabBarIcon: ({color}) => (
            <Icon name="iframe-outline" color={color} size={28} />
          ),
        }}
      />
    }
    </Tab.Navigator>
  );
}
