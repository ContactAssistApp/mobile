import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import colors from 'assets/colors';
import CustomIcon from 'assets/icons/CustomIcon.js';
import {strings} from 'locales/i18n';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateLocationData} from './actions.js';
import PropTypes from 'prop-types';

class Import extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('assets/health/map.png')} />
        <Text style={styles.title}>{strings('import.long_text')}</Text>
        <Text style={styles.description}>{strings('import.description')}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.updateLocationData({
              openImportModal: true,
            });
          }}>
          <CustomIcon
            name={'import24'}
            color={'white'}
            size={16}
            style={styles.import_icon}
          />
          <Text style={styles.button_text}>{strings('import.btn_text')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 55,
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    textTransform: 'capitalize',
    color: colors.section_title,
    textAlign: 'center',
    paddingBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.secondary_body_copy,
    paddingBottom: 15,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 16.5,
    paddingHorizontal: 20,
    backgroundColor: colors.primary_theme,
    borderRadius: 4,
  },
  import_icon: {
    paddingRight: 10,
  },
  button_text: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    textTransform: 'uppercase',
    color: 'white',
  },
});

Import.propTypes = {
  updateLocationData: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  updateLocationData,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(Import);
