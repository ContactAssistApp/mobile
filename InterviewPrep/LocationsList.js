import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';
import SectionHeader from './SectionHeader';
import Location from 'utils/location';
import {strings} from 'locales/i18n';

class LocationsList extends Component {
  constructor() {
    super();
    this.state = {
      addresses: [],
    };
  }

  componentDidMount() {
    this.fetchAddresses();
  }

  fetchAddresses = async () => {
    const addresses = await Location.fetchAddresses(new Date(), 14);
    this.setState({
      addresses,
    });
  };

  render() {
    return (
      <>
        <SectionHeader header={strings('general.locations_txt')} />
        {this.state.addresses.map((item, idx) => {
          const {name, address} = item;
          return (
            <View style={styles.address_card} key={idx}>
              <Text style={styles.name}>{name}</Text>
              {address !== '' && <Text style={styles.address}>{address}</Text>}
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
