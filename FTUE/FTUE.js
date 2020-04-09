import 'react-native-gesture-handler';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppIntroSlider from 'react-native-app-intro-slider';
import CustomIcon from '../assets/icons/CustomIcon.js';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SetStoreData} from '../utils/asyncStorage';
import colors from '../assets/colors.js';

class FTUE extends Component {
  renderItem = ({item}) => {
    if (item.key === 'ftue_5') {
      return (
        <View style={styles.ftue_container}>
          <View style={styles.ftue_bg_container}>
            <ImageBackground style={styles.ftue_bg} source={item.image}>
              <View style={styles.ftue_links}>
                <View style={styles.privacy_link}>
                  <CustomIcon
                    name={'lock16'}
                    color={'white'}
                    size={16}
                  />
                  <Text style={styles.privacy_text}>Privacy</Text>
                </View>
                <View style={styles.terms_link}>
                  <Text style={styles.term_text}>Terms and Conditions</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.ftue_text_container}>
            <Text style={styles.ftue_title}>{item.title}</Text>
            <TouchableOpacity style={styles.start_button} onPress={this.onDone}>
              <Text style={styles.start_button_text}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.ftue_container}>
          <View style={styles.ftue_bg_container}>
            <ImageBackground style={styles.ftue_bg} source={item.image} />
          </View>
          <View style={styles.ftue_text_container}>
            <Text style={styles.ftue_title}>{item.title}</Text>
            <Text style={styles.ftue_text}>{item.text}</Text>
          </View>
        </View>
      );
    }
  };

  onDone = () => {
    SetStoreData('ENABLE_FTUE', 'false');
    this.props.handleOnDone();
  };

  render() {
    const slides = [
      {
        key: 'ftue_1',
        title: 'Welcome to CovidSafe',
        text: 'CovidSafe notifies you if you may have been exposed to coronavirus and helps you monitor any symptoms you\'re having.',
        image: require('../assets/ftue/ftue_1.png'),
      },
      {
        key: 'ftue_2',
        title: 'Exposure Notifcations',
        text: 'Learn if you might have been exposed. If you\'ve recently visited a location with a risk of COVID-19 exposure, you\'ll get a notification letting you know.',
        image: require('../assets/ftue/ftue_2.png'),
      },
      {
        key: 'ftue_3',
        title: 'Self-Care Tips',
        text: 'Take care of yourself and others Get self-care tips, connect with a healthcare professional if your symptoms worsen, and report locations you recently visited to protect others.',
        image: require('../assets/ftue/ftue_3.png'),
      },
      {
        key: 'ftue_4',
        title: 'Your Privacy',
        text: 'Any information you contribute is protected. Learn more about how your information is used and protected on the Privacy page in Settings.',
        image: require('../assets/ftue/ftue_4.png'),
      },
      {
        key: 'ftue_5',
        title: 'Let\'s slow the spread of COVID-19 together',
        image: require('../assets/ftue/ftue_5.png'),
      },
    ];

    return (
      <AppIntroSlider
        renderItem={this.renderItem}
        data={slides}
        onDone={this.onDone}
        showNextButton={false}
        showDoneButton={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  ftue_container: {
    flex: 1,
  },
  ftue_bg_container: {
    flex: 7,
    width: '100%',
  },
  ftue_bg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ftue_text_container: {
    backgroundColor: colors.primary_theme,
    flex: 3,
    padding: 20,
  },
  ftue_title: {
    fontWeight: 'bold',
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: 0.33,
    paddingBottom: 15,
    color: 'white',
  },
  ftue_text: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: 'white',
  },
  start_button: {
    borderRadius: 8,
    backgroundColor: 'white',
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 5,
  },
  start_button_text: {
    color: colors.primary_theme,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '500',
  },
  ftue_links: {
    alignItems: 'center',
    backgroundColor: colors.primary_theme,
    borderRadius: 100,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 22,
    position: 'absolute',
  },
  privacy_link: {
    paddingRight: 8,
    marginRight: 8,
    borderColor: 'white',
    borderRightWidth: 1,
    flexDirection: 'row',
  },
  privacy_text: {
    color: 'white',
    paddingLeft: 5,
  },
  term_text: {
    color: 'white',
  },
});

FTUE.propTypes = {
  handleOnDone: PropTypes.func.isRequired,
};

export default FTUE;
