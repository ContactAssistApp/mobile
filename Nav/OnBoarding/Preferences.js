import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateFTUE} from '../actions';
import PropTypes from 'prop-types';
import colors from 'assets/colors';
import Notification from 'Settings/Notification';
import Location from 'Settings/Location';
import Import from 'Settings/Import';
import AnalyticsOptIn from 'Settings/AnalyticsOptIn';
import {strings} from 'locales/i18n';

class Preferences extends Component {
  completeFTUE = () => {
    this.props.updateFTUE({
      field: 'enableFTUE',
      value: 'false',
    });
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.intro_container}>
            <Text style={styles.intro_text}>{strings('global.stopping')}</Text>
          </View>
          <View style={styles.settings}>
            <Notification />
            <Location />
            <Import />
            <AnalyticsOptIn />
          </View>
          <TouchableOpacity
            style={styles.next_button}
            onPress={() => {
              this.completeFTUE();
              navigate('BottomNav');
            }}>
            <Text style={styles.next_button_text}>
              {strings('next.btn_text')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  intro_container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  intro_text: {
    color: colors.secondary_body_copy,
  },
  settings: {
    marginHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  next_button: {
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 8,
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
  },
  next_button_text: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: 'white',
  },
});

Preferences.propTypes = {
  updateFTUE: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateFTUE,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(Preferences);
