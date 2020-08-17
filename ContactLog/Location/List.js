import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text} from 'react-native';
import colors from 'assets/colors';
import ActionButton from './ActionButton';

class List extends Component {
  render() {
    const {
      contactLocationData: {addresses},
    } = this.props;

    return (
      <>
        {addresses.map(item => {
          const {name, address, timerange, time} = item;
          return (
            <View style={styles.address_card} key={time}>
              <View style={styles.address_content}>
                <Text style={styles.name}>{name}</Text>
                {address !== '' && (
                  <Text style={styles.address}>{address}</Text>
                )}
                <Text style={styles.time}>{timerange}</Text>
              </View>
              <ActionButton
                time={time}
                refreshLocations={this.props.refreshLocations}
              />
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
    borderWidth: 1,
    borderColor: colors.card_border,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 5,
    paddingVertical: 17,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  address_content: {
    width: 280,
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
    contactLocationData: state.contactLocationReducer,
  };
};

export default connect(mapStateToProps)(List);
