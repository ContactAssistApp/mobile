import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import colors from '../assets/colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import DateConverter from '../utils/date';
import {updateContactLog} from './actions.js';
import Import from './Import';
import Location from '../utils/location';
import { strings, fmt_date } from '../locales/i18n';

class Locations extends Component {
  constructor() {
    super();

    this.state = {
      addresses: [],
    };
  }

  componentDidMount() {
    const {date} = this.props;
    this.fetchAddresses(date);
  }

  componentDidUpdate(prevProps) {
    const {date} = this.props;

    if (prevProps.date !== date) {
      this.fetchAddresses(date);
    }
  }

  fetchAddresses = date => {
    const addresses = Location.fetchAddresses(
      new Date(date.replace(/-/g, '/')),
    );

    this.setState({
      addresses,
    });
  };

  render() {
    const {date} = this.props;

    return (
      <ScrollView>
        {this.state.addresses && this.state.addresses.length > 0 ?
          <>
            <Text style={styles.date}>
            { fmt_date(new Date(date.replace(/-/g, '/')), "ddd, MMM Do") }
            </Text>
            <Text style={styles.sub_header}>{strings("locations.timeline_text")}</Text>
            {this.state.addresses.map((item, idx) => {
              const {name, address} = item;
              return (
                <View style={styles.address_card} key={idx}>
                  <Text style={styles.name}>{name}</Text>
                  {address !== '' && (
                    <Text style={styles.address}>{address}</Text>
                  )}
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
