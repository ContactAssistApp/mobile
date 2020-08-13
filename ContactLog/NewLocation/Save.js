import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import colors from 'assets/colors';

class Save extends Component {
  render() {
    const {disabled} = this.props;

    const disableClass = disabled ? '' : styles.active;

    return (
      <>
        <TouchableOpacity disabled={disabled}>
          <Text style={[styles.save_button, styles.active]}>
            {strings('locations.save_button')}
          </Text>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  save_button: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  active: {
    color: colors.primary_theme,
  }
});

Save.propTypes = {

};


const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(Save);
