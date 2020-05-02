import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import colors from '../assets/colors';
import {NativeModules} from 'react-native';
import {connect} from 'react-redux';
import DateConverter from '../utils/date';
import {LocationData} from '../utils/LocationData';

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

    this.fetchAddresses(selectedDate);
  }

  componentDidUpdate(prevProps) {
    const {
      contactLogData: {date: selectedDate},
    } = this.props;

    if (prevProps.contactLogData.date.getTime() !== selectedDate.getTime()) {
      this.fetchAddresses(selectedDate);
    }
  }

  fetchAddresses = selectedDate => {
    LocationData.getLocationData().then(locations => {
      if (locations && locations.length > 0) {
        const filteredLog = locations.filter(location => {
          return new Date(location.time).getDate() === selectedDate.getDate();
        });
        NativeModules.Locations.reverseGeoCode(filteredLog, addresses => {
          this.setState({
            addresses,
          });
        });
      }
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
          const format = time =>
            DateConverter.timeString(parseInt(time.trim(), 10));
          const tsStringList = timePeriods
            .map(timePeriod => {
              const tsList = timePeriod.split('-');
              const start = format(tsList[0]);
              const end = format(tsList[1]);
              return `${start}-${end}`;
            })
            .join('  ');
          return (
            <View style={styles.address_card} key={idx}>
              {address[0] !== '' && <Text style={styles.name}>{name}</Text>}
              {address[1] !== '' && (
                <Text style={styles.address}>{address[1]}</Text>
              )}
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
    color: colors.module_title,
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
