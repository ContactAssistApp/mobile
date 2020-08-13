import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import colors from 'assets/colors';
import {addLocation} from 'realm/realmLocationTasks';

class Save extends Component {
  handleSave = async () => {
    const {
      newLocationData: {name, address},
      selectedTime,
    } = this.props;
    const requiredFields = [name];

    requiredFields.find(field => {
      if (!field) {
        Alert.alert('', strings('locations.required_field_alert'), [
          {
            text: strings('locations.alert_dismiss_button'),
            style: 'cancel',
          },
        ]);
      }
    });

    if (name) {
      await addLocation({
        time: selectedTime,
        name,
        address,
      });

      this.props.handleSaveSuccess();
    }
  };

  render() {
    const {
      newLocationData: {enableSave},
    } = this.props;

    const disableClass = enableSave ? styles.active : '';

    return (
      <>
        <TouchableOpacity disabled={!enableSave} onPress={this.handleSave}>
          <Text style={[styles.save_button, disableClass]}>
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

const mapStateToProps = state => {
  return {
    newLocationData: state.newLocationReducer,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Save);
