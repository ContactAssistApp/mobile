import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import colors from '../assets/colors';
import {NativeModules} from 'react-native';
import {GetStoreData} from '../utils/asyncStorage';
import {connect} from 'react-redux';
import DateConverter from '../utils/date';
import data from './static.json';

class Locations extends Component {
  constructor() {
    super();
    this.state = {
      addresses: [],
    };
  }

  componentDidMount() {
    const {
      contactLogData: {date: selectedDate},
    } = this.props;

    const locations = data.locations;
    // this.getLocationData().then(locations => {
    if (locations && locations.length > 0) {
      const filteredLog = locations.filter(location => {
        return new Date(location.time).getDate() === selectedDate.getDate();
      });
      NativeModules.Locations.reverseGeoCode(filteredLog, addresses => {
        console.log(addresses);
        this.setState({
          addresses,
        });
      });
    }
    // });
  }

  getLocationData = () => {
    return GetStoreData('LOCATION_DATA').then(locationArrayString => {
      let locationArray = [];
      if (locationArrayString !== null) {
        locationArray = JSON.parse(locationArrayString);
      }
      return locationArray;
    });
  };

  render() {
    const {
      contactLogData: {date},
    } = this.props;

    return (
      <ScrollView>
        <Text style={styles.date}>{DateConverter.dateString(date)}</Text>
        <Text style={styles.sub_header}>RECENT LOCATIONS</Text>
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    fontSize: 18,
    lineHeight: 25,
    textTransform: 'capitalize',
    color: '#333333',
    padding: 20,
  },
  sub_header: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 25,
    textTransform: 'uppercase',
    color: colors.gray_icon,
    paddingHorizontal: 20,
  },
  address_card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.card_border,
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

const mapStateToProps = state => {
  return {
    contactLogData: state.contactLogReducer,
  };
};

export default connect(mapStateToProps)(Locations);
