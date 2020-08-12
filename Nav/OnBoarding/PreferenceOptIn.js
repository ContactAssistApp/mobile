import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateFTUE} from '../actions';
import PropTypes from 'prop-types';
import colors from '../../assets/colors';
import {strings} from '../../locales/i18n';
import CustomIcon from '../../assets/icons/CustomIcon';

class PreferenceOptIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
    };
  }

  render = () => (
    <SafeAreaView style={styles.intro_container}>
      <View style={styles.content}>
        <Image style={styles.icon} source={this.props.image} />
        <Text style={styles.content_title_text}>{this.props.title}</Text>
        <Text style={styles.content_description_text}>
          {this.props.description}
        </Text>
        <Text style={styles.content_reminder_text}>{this.props.reminder}</Text>
      </View>
      <View style={styles.button_container}>
        <TouchableOpacity
          style={[
            styles.button,
            this.state.enabled
              ? styles.turn_on_button_enabled
              : styles.turn_on_button,
          ]}
          onPress={this._turnOnOption}>
          <Text
            style={[
              styles.button_text,
              this.state.enabled
                ? styles.turn_on_button_text_enabled
                : styles.turn_on_button_text,
            ]}>
            {this.state.enabled && (
              <CustomIcon
                name="checkmark24"
                style={styles.turn_on_button_checkmark}
              />
            )}
            {'   '}
            {this.state.enabled ? this.props.turned_on : this.props.turn_on}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.skip_button]}
          onPress={this._nextPressed}>
          <Text style={[styles.button_text, styles.skip_button_text]}>
            {strings('global.preference_skip')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  onDone = () => {
    this.setState({showRealApp: true});
  };

  _nextPressed = () => {
    this.props.navigation.navigate('ThankYou');
  };

  _turnOnOption = () => {
    this.setState({enabled: true});
    // this._nextPressed();
  };

  completeFTUE = () => {
    this.props.updateFTUE({
      field: 'enableFTUE',
      value: 'false',
    });
  };
}

const styles = StyleSheet.create({
  button_container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
  intro_container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  content: {
    marginTop: 100,
    marginHorizontal: 40,
  },
  content_reminder_text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  content_description_text: {
    fontSize: 15,
    marginTop: 16,
  },
  content_title_text: {
    alignSelf: 'center',
    textAlign: 'center',
    fontStyle: 'normal',
    fontSize: 25,
    lineHeight: 30,
    marginTop: 16,
    marginHorizontal: 16,
  },
  icon: {
    alignSelf: 'center',
  },
  button: {
    borderRadius: 4,
    flexDirection: 'column',
    paddingVertical: 18,
    marginVertical: 8,
    marginHorizontal: 24,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    alignItems: 'center',
  },
  button_text: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
  },
  turn_on_button: {
    backgroundColor: colors.primary_theme,
  },
  turn_on_button_enabled: {
    backgroundColor: colors.pref_enabled_background,
  },
  turn_on_button_text: {
    color: 'white',
  },
  turn_on_button_text_enabled: {
    color: 'black',
  },
  turn_on_button_checkmark: {
    fontSize: 18,
  },
  skip_button: {
    backgroundColor: 'white',
  },
  skip_button_text: {
    color: 'black',
  },
});

PreferenceOptIn.propTypes = {
  updateFTUE: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({updateFTUE}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(PreferenceOptIn);
