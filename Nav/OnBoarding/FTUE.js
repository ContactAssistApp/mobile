import 'react-native-gesture-handler';
import React, {Component} from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {SetStoreData} from 'utils/asyncStorage';
import colors from 'assets/colors.js';
import {strings} from 'locales/i18n';
import {PRIVACY_FAQ_URL} from 'utils/constants';

class FTUE extends Component {
  renderItem = ({item}) => (
    <View style={styles.ftue_container}>
      <View style={styles.ftue_bg_container}>
        <ImageBackground style={styles.ftue_bg} source={item.image} />
      </View>
      <View style={styles.ftue_text_container}>
        <Text style={styles.ftue_title}>{item.title}</Text>
        {item.key === 'ftue_5' ? (
          <TouchableOpacity style={styles.start_button} onPress={this.onDone}>
            <Text style={styles.start_button_text}>
              {strings('get.started_text')}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.ftue_text}>{item.text}</Text>
        )}
      </View>
    </View>
  );

  onDone = () => {
    SetStoreData('ENABLE_FTUE', 'false');
    this.props.navigation.navigate('Preferences');
  };

  render() {
    const slides = [
      {
        key: 'ftue_1',
        title: strings('global.storyTitle1'),
        text: strings('global.story1'),
        image: require('../../assets/ftue/ftue_1.png'),
      },
      {
        key: 'ftue_2',
        title: strings('global.storyTitle2'),
        text: strings('global.story2'),
        image: require('../../assets/ftue/ftue_2.png'),
      },
      {
        key: 'ftue_3',
        title: strings('global.storyTitle3'),
        text: strings('global.story3'),
        image: require('../../assets/ftue/ftue_3.png'),
      },
      {
        key: 'ftue_4',
        title: strings('global.storyTitle4'),
        text: (
          <>
            {strings('global.story4_interpolated.part1_normal')}
            <Text style={styles.bold_text}>
              {strings('global.story4_interpolated.part2_bold')}
            </Text>
            {strings('global.story4_interpolated.part3_normal')}
            <Text
              style={styles.link_text}
              onPress={() => Linking.openURL(PRIVACY_FAQ_URL)}>
              {strings('global.story4_interpolated.part4_link')}
            </Text>
            {strings('global.story4_interpolated.part5_normal')}
          </>
        ),
        image: require('../../assets/ftue/ftue_4.png'),
      },
      {
        key: 'ftue_5',
        title: strings('global.startText'),
        image: require('../../assets/ftue/ftue_5.png'),
      },
    ];

    return (
      <AppIntroSlider
        renderItem={this.renderItem}
        data={slides}
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
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 26,
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
  privacy_text: {
    color: 'white',
    paddingLeft: 5,
  },
  term_text: {
    color: 'white',
  },
  bold_text: {
    fontWeight: '700',
  },
  link_text: {
    textDecorationLine: 'underline',
  },
});

export default FTUE;
