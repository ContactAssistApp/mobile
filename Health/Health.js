import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Symptoms from '../Symptoms/Symptoms';
import Report from './Report';
import colors from '../assets/colors';

class Health extends Component {
  constructor() {
    super();
    this.state = {
      index: 0,
      routes: [
        {key: 'symptoms', title: 'symptoms'},
        {key: 'diagnosis', title: 'diagnosis'},
      ],
    };
  }

  render() {
    const symptomsRoute = () => {
      return <Symptoms navigate={this.props.navigation.navigate} />;
    };
    const diagnosisRoute = () => <Report />;
    const initialLayout = {width: Dimensions.get('window').width};

    const renderScene = SceneMap({
      symptoms: symptomsRoute,
      diagnosis: diagnosisRoute,
    });

    const renderTabBar = props => (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: colors.primary_theme}}
        style={styles.tab_bar}
        activeColor={colors.section_title}
        inactiveColor={colors.gray_icon}
      />
    );

    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('../assets/home/logo.png')}
          />
          <Text style={styles.title}>Health Report</Text>
        </View>
        <TabView
          navigationState={this.state}
          renderTabBar={renderTabBar}
          renderScene={renderScene}
          onIndexChange={idx => {
            this.setState({index: idx});
          }}
          initialLayout={initialLayout}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  tab_bar: {
    backgroundColor: 'white',
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
