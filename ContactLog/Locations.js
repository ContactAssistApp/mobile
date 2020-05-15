import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import colors from '../assets/colors';
import {NativeModules} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import DateConverter from '../utils/date';
import {updateContactLog} from './actions.js';
import Import from './Import';
import { strings, fmt_date } from '../locales/i18n';

class Locations extends Component {
  constructor() {
    super();

    this.state = {
      addresses: [],
    };
  }

  componentDidMount() {
    const {
      date,
      contactLogData: {allCoordinates, cachedAddresses},
    } = this.props;

    if (!cachedAddresses.hasOwnProperty(date) &&
      allCoordinates[date] &&
      allCoordinates[date].length > 0) {
      this.fetchAddresses(allCoordinates[date]);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      date,
      contactLogData: {allCoordinates, cachedAddresses},
    } = this.props;

    if (!cachedAddresses.hasOwnProperty(date) &&
      allCoordinates[date] &&
      allCoordinates[date].length > 0) {
      this.fetchAddresses(allCoordinates[date]);
    }
  }

  fetchAddresses = coordinates => {
    let {
      date,
      contactLogData: {cachedAddresses},
    } = this.props;

    NativeModules.Locations.reverseGeoCode(coordinates, addresses => {
      cachedAddresses[date] = addresses;
      this.props.updateContactLog({
        field: 'cachedAddresses',
        value: cachedAddresses,
      });
      this.setState({
        addresses,
      });
    });
  };

  render() {
    const {
      date,
      contactLogData: {cachedAddresses},
    } = this.props;

    const addresses = cachedAddresses.hasOwnProperty(date)
      ? cachedAddresses[date] : this.state.address;

    return (
      <ScrollView>
        {addresses && addresses.length > 0 ?
          <>
            <Text style={styles.date}>
            { fmt_date(new Date(date.replace(/-/g, '/')), "ddd, MMM Do") }
            </Text>
            <Text style={styles.sub_header}>{strings("locations.timeline_text")}</Text>
            {addresses.map((address, idx) => {
              const name = address[0] === '' ? strings('unknown.address_txt') : address[0];
              const timePeriods = address[2].split(',');
              const format = time => fmt_date(parseInt(time), "LT")
              const tsStringList = timePeriods
                .map(timePeriod => {
                  const tsList = timePeriod.split('-');
                  const start = format(tsList[0]);
                  const end = format(tsList[1]);
                  return `${start}-${end}`;
                })
                .join(' ');
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
          </> :
          <Import />
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    fontSize: 18,
    lineHeight: 25,
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

Locations.propTypes = {
  updateContactLog: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    contactLogData: state.contactLogReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateContactLog
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Locations);
