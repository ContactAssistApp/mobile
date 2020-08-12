import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from 'assets/colors';
import {strings} from 'locales/i18n';
import CustomIcon from 'assets/icons/CustomIcon.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateLocationData} from './actions.js';
import PropTypes from 'prop-types';

class MissingLocation extends Component {
  render() {
    return (
      <View style={styles.missing_locations_container}>
        <Text style={styles.missing_locations_header}>
          {strings('missing_locations.title')}
        </Text>
        <Text style={styles.missing_locations_description}>
          {strings('missing_locations.description')}
        </Text>
        <TouchableOpacity
          style={styles.import_button}
          onPress={() => {
            this.props.updateLocationData({openImportModal: true});
          }}>
          <CustomIcon
            name={'import24'}
            size={20}
            color={colors.primary_theme}
            style={styles.import_icon}
          />
          <Text style={styles.import_text}>
            {strings('missing_locations.import_button')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  missing_locations_container: {
    padding: 24,
  },
  missing_locations_header: {
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    color: colors.module_title,
    paddingBottom: 15,
  },
  missing_locations_description: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.body_copy,
    paddingBottom: 15,
  },
  import_button: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 16,
    width: 214,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  import_icon: {
    paddingRight: 5,
  },
  import_text: {
    fontWeight: '500',
    color: colors.primary_theme,
  },
});

MissingLocation.propTypes = {
  updateLocationData: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  updateLocationData,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(MissingLocation);
