import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import colors from '../assets/colors';
import {NativeModules} from 'react-native';

class Locations extends Component {
  constructor() {
    super();
    this.state = {
      addresses: [],
    };
  }

  componentDidMount() {
    this.fetchAddresses();
  }

  fetchAddresses = () => {
    const locations = [
    {
      latitude: 50.934430,
      longitude: -102.816690,
      time: 1587843741483,
    },
    {
      latitude: 50.934430,
      longitude: -102.816690,
      time: 1587843793871,
    },
    {
      latitude: 50.934430,
      longitude: -102.816690,
      time: 1587843806886,
    },
    {
      latitude: 40.742050,
      longitude: -73.993851,
      time: 1587843813376,
    }];

    NativeModules.Locations.reverseGeoCode(locations, addresses => {
      this.setState({
        addresses,
      });
    });
  }

  render() {
    return (
      <>
        <Text style={styles.date}>
          Wednesday, April 15
        </Text>
        <Text style={styles.sub_header}>
          RECENT LOCATIONS
        </Text>
        {
          this.state.addresses.map((address) => {
            return(
              <View style={styles.address_card}>
                <Text>{address}</Text>
              </View>
            )
          })
        }
      </>
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
    padding: 15,
  }
});

export default Locations;
