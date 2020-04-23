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
import colors from '../../assets/colors';
import Symptoms from './Symptoms';
import Locations from './Locations';
import People from './People';
import Summary from './Summary';

class InterviewPrepContainer extends Component {
  constructor() {
    super();
    this.state = {
      index: 0,
      routes: [
        {key: 'symptoms', title: '1. Symptoms'},
        {key: 'locations', title: '2. Locations'},
        {key: 'people', title: '3. People'},
        {key: 'summary', title: '4. Summary'},
      ],
    };
  }

  render() {
    const symptomsRoute = () => <Symptoms />;
    const locationsRoute = () => <Locations />;
    const peopleRoute = () => <People />;
    const summaryRoute = () => <Summary />;
    const initialLayout = {width: Dimensions.get('window').width};

    const renderScene = SceneMap({
      symptoms: symptomsRoute,
      locations: locationsRoute,
      people: peopleRoute,
      summary: summaryRoute,
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
        <SafeAreaView style={styles.status_bar}/>
        <View style={styles.header}>
          <Text style={styles.title}>Interview preparation</Text>
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

export default InterviewPrepContainer;
