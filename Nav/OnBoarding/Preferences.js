import 'react-native-gesture-handler';
import React, { Component } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateFTUE } from '../actions';
import PropTypes from 'prop-types';
import colors from '../../assets/colors';
import Notification from '../../Settings/Notification';
import Location from '../../Settings/Location';
import Import from '../../Settings/Import';
import AnalyticsOptIn from '../../Settings/AnalyticsOptIn';
import { strings } from '../../locales/i18n';
import { SetStoreData } from '../../utils/asyncStorage';

class Preferences extends Component {
  renderItem = ({ item }) => {
    if (item.key === 'pref_5') {
      return (
        <SafeAreaView style={styles.intro_container}>
          <View>
            <View style={styles.content}>
              <Image style={styles.icon} source={item.image}></Image>
              <Text style={styles.content_title_text}>{item.title}</Text>
            </View>
            {/* <View style={styles.settings}>
            <Notification />
            <Location />
            <Import />
            <AnalyticsOptIn />
          </View>
          <TouchableOpacity
            style={styles.next_button}
            onPress={() => {
              this.completeFTUE();
              SetStoreData('ENABLE_FTUE', 'false');
              navigate('BottomNav');
            }}>
            <Text style={styles.next_button_text}>
              {strings('next.btn_text')}
            </Text>
          </TouchableOpacity> */}
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.intro_container}>
          <View>
            <View style={styles.content}>
              <Image style={styles.icon} source={item.image}></Image>
              <Text style={styles.content_title_text}>{item.title}</Text>
              <Text style={styles.content_description_text}>{item.description}</Text>
              <Text style={styles.content_reminder_text}>{item.reminder}</Text>
            </View>
            <View style={styles.button_container}>
              <TouchableOpacity style={styles.turn_on_button}>
                <Text style={styles.turn_on_button_text}>{item.turn_on}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skip_button} onPress={() => this._nextPressed(item)}>
                <Text style={styles.skip_button_text}>{"Skip"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }
  };

  _renderNextButton = () => {
    return (
      <View style={styles.skip_button}>
        <Text style={styles.skip_button_text}>{"Skip"}</Text>
      </View>
    );
  };

  onDone = () => {
    this.setState({ showRealApp: true });
  }

  _nextPressed = (item) => {
    // if (item.index > 0) {
    //   this._skipPressed();
    //   return;
    // }
    if (item.key === 'pref_4') {
      this.props.navigation.navigate('ThankYou');
    } else {
      this.AppIntroSlider.goToSlide(item.index + 1);
    }
  }

  completeFTUE = () => {
    this.props.updateFTUE({
      field: 'enableFTUE',
      value: 'false',
    });
  };

  render() {
    const { navigate } = this.props.navigation;
    const slides = [
      {
        key: 'pref_1',
        image: require('../../assets/preference/preference_1.png'),
        title: strings('global.preference1_headline'),
        description: strings('global.preference1_description'),
        reminder: strings('global.preference1_reminder'),
        turn_on: strings('global.preference1_turn_on'),
        index: 0,
      },
      {
        key: 'pref_2',
        image: require('../../assets/preference/preference_2.png'),
        title: strings('global.preference2_headline'),
        description: strings('global.preference2_description'),
        reminder: strings('global.preference2_reminder'),
        turn_on: strings('global.preference2_turn_on'),
        index: 1,
      },
      {
        key: 'pref_3',
        image: require('../../assets/preference/preference_3.png'),
        title: strings('global.preference3_headline'),
        description: strings('global.preference3_description'),
        reminder: strings('global.preference3_reminder'),
        turn_on: strings('global.preference3_turn_on'),
        index: 2,
      },

      {
        key: 'pref_4',
        image: require('../../assets/preference/preference_4.png'),
        title: strings('global.preference1_headline'),
        description: strings('global.preference4_description'),
        reminder: strings('global.preference4_reminder'),
        turn_on: strings('global.preference4_turn_on'),
        index: 3,
      },
      // {
      //   key: 'pref_5',
      //   image: require('../../assets/preference/preference_3.png'),
      //   title: strings('global.preference1_headline'),
      //   description: strings('global.preference1_description'),
      //   reminder: strings('global.preference1_reminder'),
      //   turn_on: strings('global.preference1_turn_on'),
      //   index: 4,
      // }
    ];
    return (
      <AppIntroSlider
        renderItem={this.renderItem}
        data={slides}
        showNextButton={false}
        // bottomButton={true}
        showDoneButton={false}
        activeDotStyle={0, 0, 0, 0}
        dotStyle={0, 0, 0, 0}
        // renderNextButton={this._renderNextButton}
        ref={ref => this.AppIntroSlider = ref}
      />
    );
  }
}

const styles = StyleSheet.create({

  button_container: {
    flex: 1,
    // width:'100%',
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
  },
  intro_container: {
    flex: 1,
    alignItems: "center",
    width: '100%',
  },
  // intro_text: {
  //   color: colors.secondary_body_copy,
  // },
  // settings: {
  //   marginHorizontal: 20,
  //   borderRadius: 8,
  //   backgroundColor: 'white',
  // },
  // next_button: {
  //   marginHorizontal: 20,
  //   marginVertical: 40,
  //   borderRadius: 8,
  //   backgroundColor: colors.primary_theme,
  //   paddingVertical: 15,
  //   alignItems: 'center',
  // },
  // next_button_text: {
  //   fontWeight: '500',
  //   fontSize: 15,
  //   lineHeight: 20,
  //   letterSpacing: -0.24,
  //   color: 'white',
  // },
  content: {
    marginHorizontal: "10.56%",
    marginVertical: "0.88%",
    marginTop: 100,
  },
  content_reminder_text: {
    paddingVertical: "3.57%",
    fontSize: 15,
    fontWeight: "bold",
  },
  content_description_text: {
    paddingVertical: "3.57%",
    fontSize: 15,
  },
  content_title_text: {
    paddingHorizontal: "2.1%",
    paddingVertical: "5.57%",
    alignSelf: "center",
    textAlign: "center",
    fontStyle: "normal",
    fontSize: 25,
    lineHeight: 30,
  },
  icon: {
    alignSelf: "center",
  },

  turn_on_button: {
    borderRadius: 8,
    backgroundColor: 'white',
    width: '80%',
    paddingVertical: 17,
    marginVertical: 40,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 0,
    backgroundColor: colors.primary_theme,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  turn_on_button_text: {
    color: 'white',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
  },

  skip_button: {
    borderRadius: 8,
    backgroundColor: 'white',
    flexDirection: "column",
    // marginBottom: 100,
    width: '80%',
    paddingVertical: 20,
    alignItems: 'center',
    // paddingHorizontal: 120,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },

  },
  skip_button_text: {
    color: 'black',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
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
