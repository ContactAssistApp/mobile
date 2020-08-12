import 'react-native-gesture-handler';
import React, {Component} from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
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

class Preferences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationsEnabled: false,
      locationShared: false,
      importedFromGoogle: false,
      analyticsEnabled: false,
    };
  }

  slides = [
    {
      key: 'pref_1',
      image: require('../../assets/preference/preference_1.png'),
      title: strings('global.preference1_headline'),
      description: strings('global.preference1_description'),
      reminder: strings('global.preference1_reminder'),
      turn_on: strings('global.preference1_turn_on'),
      turned_on: strings('global.preference1_turned_on'),
      index: 0,
      is_enabled: () => this.state.notificationsEnabled,
      enable: () => this.setState({notificationsEnabled: true}),
    },
    {
      key: 'pref_2',
      image: require('../../assets/preference/preference_2.png'),
      title: strings('global.preference2_headline'),
      description: strings('global.preference2_description'),
      reminder: strings('global.preference2_reminder'),
      turn_on: strings('global.preference2_turn_on'),
      turned_on: strings('global.preference2_turned_on'),
      index: 1,
      is_enabled: () => this.state.locationShared,
      enable: () => this.setState({locationShared: true}),
    },
    {
      key: 'pref_3',
      image: require('../../assets/preference/preference_3.png'),
      title: strings('global.preference3_headline'),
      description: strings('global.preference3_description'),
      reminder: strings('global.preference3_reminder'),
      turn_on: strings('global.preference3_turn_on'),
      turned_on: strings('global.preference3_turned_on'),
      index: 2,
      is_enabled: () => this.state.importedFromGoogle,
      enable: () => this.setState({importedFromGoogle: true}),
    },
    {
      key: 'pref_4',
      image: require('../../assets/preference/preference_4.png'),
      title: strings('global.preference4_headline'),
      description: strings('global.preference4_description'),
      reminder: strings('global.preference4_reminder'),
      turn_on: strings('global.preference4_turn_on'),
      turned_on: strings('global.preference4_turned_on'),
      index: 3,
      is_enabled: () => this.state.analyticsEnabled,
      enable: () => this.setState({analyticsEnabled: true}),
    },
  ];

  renderItem = ({item}) => (
    <SafeAreaView style={styles.intro_container}>
      <View style={styles.content}>
        <Image style={styles.icon} source={item.image} />
        <Text style={styles.content_title_text}>{item.title}</Text>
        <Text style={styles.content_description_text}>{item.description}</Text>
        <Text style={styles.content_reminder_text}>{item.reminder}</Text>
      </View>
      <View style={styles.button_container}>
        <TouchableOpacity
          style={[
            styles.button,
            item.enabled
              ? styles.turn_on_button_enabled
              : styles.turn_on_button,
          ]}
          onPress={item.enable}>
          <Text style={[styles.button_text, styles.turn_on_button_text]}>
            {item.enabled ? item.turned_on : item.turn_on}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.skip_button]}
          onPress={() => this._nextPressed(item)}>
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

  _nextPressed = item => {
    // if (item.index > 0) {
    //   this._skipPressed();
    //   return;
    // }
    if (item.key === 'pref_4') {
      this.props.navigation.navigate('ThankYou');
    } else {
      this.AppIntroSlider.goToSlide(item.index + 1);
    }
  };

  _turnOnOption = item => {
    let newState = [...this.state.enabled];
    newState[item.index] = true;
    this.setState({enabled: newState});
    // this._nextPressed(item);
  };

  completeFTUE = () => {
    this.props.updateFTUE({
      field: 'enableFTUE',
      value: 'false',
    });
  };

  render() {
    return (
      <AppIntroSlider
        renderItem={this.renderItem}
        data={this.slides}
        showNextButton={false}
        showDoneButton={false}
        activeDotStyle={(0, 0, 0, 0)}
        dotStyle={(0, 0, 0, 0)}
        ref={ref => (this.AppIntroSlider = ref)}
      />
    );
  }
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
  skip_button: {
    backgroundColor: 'white',
  },
  skip_button_text: {
    color: 'black',
  },
});

Preferences.propTypes = {
  updateFTUE: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({updateFTUE}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(Preferences);
