import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from 'assets/colors.js';
import Home from 'Home/Home';
import Health from 'Health/Health';
import Resources from 'Resources/Resources';
import CustomIcon from 'assets/icons/CustomIcon.js';
import ContactLog from 'ContactLog/ContactLog';
import {strings} from 'locales/i18n';

const Tab = createBottomTabNavigator();

export default function BottomNav() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: colors.primary_theme,
        inactiveTintColor: colors.gray_icon,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: strings("bottom.sheet_menu_item_home"),
          tabBarIcon: ({color}) => (
            <CustomIcon name={'home24'} color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="ContactLog"
        component={ContactLog}
        options={{
          tabBarLabel: strings("bottom.sheet_menu_item_contact_log"),
          tabBarIcon: ({color}) => (
            <CustomIcon name={'contactLog24'} color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={Health}
        options={{
          tabBarLabel: strings("bottom.sheet_menu_item_health_report"),
          tabBarIcon: ({color}) => (
            <CustomIcon name={'heart24'} color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Resources"
        component={Resources}
        options={{
          tabBarLabel: strings("bottom.sheet_menu_item_resources"),
          tabBarIcon: ({color}) => (
            <CustomIcon name={'resource24'} color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
