import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import colors from '../assets/colors';

class TabView extends Component {
  render() {
    return (
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => {
          return (
            <DefaultTabBar
              backgroundColor={'white'}
              activeTextColor={colors.section_title}
              inactiveTextColor={colors.gray_icon}
              textStyle={styles.tabBarText}
              underlineStyle={styles.tabBarUnderline}
              tabStyle={styles.tabBar}
            />
          );
        }}>
        {this.props.children}
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  tabBarText: {
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  tabBarUnderline: {
    height: 2,
    backgroundColor: colors.primary_theme,
  },
  tabBar: {
    paddingTop: 10,
  },
});

export default TabView;
