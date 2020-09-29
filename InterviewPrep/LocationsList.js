import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';
import SectionHeader from './SectionHeader';
import Location from 'utils/location';
import {strings} from 'locales/i18n';
import DateHeader from './DateHeader';
import DateConverter from 'utils/date';

class LocationsList extends Component {
  constructor() {
    super();
    this.state = {
      addresses: {},
    };
  }

  componentDidMount() {
    this.fetchAddresses();
  }

  fetchAddresses = async () => {
    let today = new Date();
    const addresses = await Location.fetchAddresses(today, 14);

    let addressesMap = {};
    addresses.map(address => {
      const {time} = address;
      const date = DateConverter.calendarFormat(new Date(time));
      console.log(date);
      if (!Object.keys(addressesMap).includes(date)) {
        addressesMap[date] = [];
      }

      addressesMap[date].push(address);
    });

    this.setState({
      addresses: addressesMap,
    });
  };

  render() {
    const {addresses} = this.state;
    return (
      <>
        <SectionHeader header={strings('general.locations_txt')} />
        {Object.entries(addresses).map(([key, val]) => {
          return (
            <View key={key}>
              <DateHeader date={key} />
              {val.map((item, idx) => {
                const {name, address, timerange} = item;
                console.log(item);
                return (
                  <View style={styles.address_card} key={idx}>
                    <Text style={styles.name}>{name}</Text>
                    {address !== '' && (
                      <Text style={styles.metadata}>{address}</Text>
                    )}
                    {timerange && (
                      <Text style={styles.metadata}>{timerange}</Text>
                    )}
                  </View>
                );
              })}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    paddingVertical: 17,
    paddingHorizontal: 19,
  },
  name: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 23,
  },
  metadata: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.body_copy,
    paddingVertical: 2,
    fontWeight: '400',
  },
  time: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.body_copy,
    paddingVertical: 6,
  },
});

export default LocationsList;
