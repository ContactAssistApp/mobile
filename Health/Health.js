import React, {PureComponent} from 'react';
import {SafeAreaView, View, StyleSheet, Text, Image} from 'react-native';
import Symptoms from '../Symptoms/Symptoms';
import Report from './Report';
import colors from '../assets/colors';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';

class Health extends PureComponent {
  render() {
    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('../assets/home/logo.png')}
          />
          <Text style={styles.title}>Health Report[DEMO]</Text>
        </View>
        <ScrollableTabView
          initialPage={1}
          renderTabBar={() => {
            return (
              <DefaultTabBar
                backgroundColor={'white'}
                activeTextColor={colors.section_title}
                inactiveTextColor={colors.gray_icon}
                textStyle={{fontWeight: '500', textTransform: 'uppercase'}}
                underlineStyle={{
                  height: 2,
                  backgroundColor: colors.primary_theme
                }}
                tabStyle={{paddingTop: 10}}
              />
            );
          }}>
          <Symptoms
            tabLabel={'symptoms'}
            navigate={this.props.navigation.navigate} />
          <Report tabLabel={'diagnosis'} />
        </ScrollableTabView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  status_bar: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  title: {
    fontSize: 24,
    color: colors.section_title,
    fontWeight: '500',
  },
});

export default Health;
