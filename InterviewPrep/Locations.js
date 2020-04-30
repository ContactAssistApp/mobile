import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import colors from '../assets/colors';
import data from '../ContactLog/static.json';
import {NativeModules} from 'react-native';
import DateConverter from '../utils/date';
import LocationsList from './LocationsList';

class Locations extends Component {
  constructor() {
    super();
    this.state = {
      addresses: [],
    };
  }

  render() {
    const locations = data.locations;
    let date = new Date();
    date.setDate(date.getDate() - 14);
    if (locations && locations.length > 0) {
      const filteredLog = locations.filter(location => {
        return new Date(location.time) > date;
      });

      NativeModules.Locations.reverseGeoCode(filteredLog, addresses => {
        this.setState({
          addresses,
        });
      });
    }
    return (
      <>
        <View style={styles.intro_container}>
          <View style={styles.header}>
            <Image
              style={styles.icon}
              source={require('../assets/health/map.png')}
            />
            <Text style={styles.title}>
              Review your location history{'\n'}from the last 14 days.
            </Text>
          </View>
          <Text style={styles.description}>
            Below are locations you’ve recently visited for 10 minutes or more.
          </Text>
          <LocationsList />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  intro_container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 70,
  },
  title: {
    paddingLeft: 10,
    fontSize: 18,
    lineHeight: 25,
    color: colors.section_title,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.module_title,
    paddingHorizontal: 20,
  },
  section_title: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    color: colors.secondary_body_copy,
    padding: 20,
    backgroundColor: colors.card_border,
  },
  address_card: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.card_border,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 5,
    paddingVertical: 17,
    paddingHorizontal: 11,
  },
  name: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 23,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.body_copy,
    paddingVertical: 6,
  },
  time: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.body_copy,
    paddingVertical: 6,
  },
});

export default Locations;
