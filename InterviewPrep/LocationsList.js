import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';
import data from '../ContactLog/static.json';
import {NativeModules} from 'react-native';
import DateConverter from '../utils/date';
import SectionHeader from './SectionHeader';

class LocationsList extends Component {
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
        <SectionHeader header={'general locations'} />
        {this.state.addresses.map((address, idx) => {
          const name = address[0] === '' ? 'Unknown Location' : address[0];
          const timePeriods = address[2].split(',');
          const tsStringList = timePeriods.map(timePeriod => {
            const tsList = timePeriod.split('-');
            const start = DateConverter.timeString(parseInt(tsList[0].trim()));
            const end = DateConverter.timeString(parseInt(tsList[1].trim()));
            return `${start}-${end}`;
          });
          return (
            <View style={styles.address_card} key={idx}>
              {address[0] !== '' && <Text style={styles.name}>{name}</Text>}
              {address[1] !== '' && <Text style={styles.address}>{address[1]}</Text>}
              <Text style={styles.time}>{tsStringList}</Text>
            </View>
          );
        })}
      </>
    );
  }
}

const styles = StyleSheet.create({
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

export default LocationsList;
