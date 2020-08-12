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
import colors from '../../assets/colors';
import {strings} from '../../locales/i18n';

class ThankYou extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image
            style={styles.icon}
            source={require('../../assets/preference/preference_5.png')}
          />
          <Text style={styles.content_title_text}>
            {strings('global.preference5_headline')}
          </Text>
          <Text style={styles.content_description_text}>
            {strings('global.preference5_description')}
          </Text>
          <TouchableOpacity
            style={styles.turn_on_button}
            onPress={() => this.props.navigation.navigate('BottomNav')}>
            <Text style={styles.turn_on_button_text}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.primary_theme,
  },
  content: {
    marginHorizontal: '6.56%',
    marginVertical: '0.88%',
    marginTop: 200,
  },
  content_reminder_text: {
    paddingVertical: '3.57%',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
  },
  content_description_text: {
    fontSize: 15,
    color: 'white',
    marginHorizontal: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  content_title_text: {
    paddingHorizontal: '2.1%',
    paddingVertical: '5.57%',
    marginHorizontal: 20,
    alignSelf: 'center',
    textAlign: 'center',
    fontStyle: 'normal',
    fontSize: 25,
    lineHeight: 30,
    color: 'white',
  },
  icon: {
    alignSelf: 'center',
  },
  turn_on_button: {
    borderRadius: 8,
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 50,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
  },
  turn_on_button_text: {
    color: colors.primary_theme,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
  },

  skip_button: {
    borderRadius: 8,
    backgroundColor: 'white',
    flexDirection: 'column',
    // marginBottom: 100,
    width: '80%',
    paddingVertical: 20,
    alignItems: 'center',
    // paddingHorizontal: 120,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
  },
  skip_button_text: {
    color: 'black',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
  },
});

export default ThankYou;
