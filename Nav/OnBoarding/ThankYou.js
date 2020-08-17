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
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateFTUE} from '../actions';

class ThankYou extends Component {
  completeFTUE = () => {
    this.props.updateFTUE({
      field: 'enableFTUE',
      value: 'false',
    });
  };

  onFinish = () => {
    this.completeFTUE();
    this.props.navigation.navigate('BottomNav');
  };

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
        </View>
        <View style={styles.button_container}>
          <TouchableOpacity
            style={styles.finish_button}
            onPress={this.onFinish}>
            <Text style={styles.finish_button_text}>Done</Text>
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
    marginTop: 100,
    marginHorizontal: 40,
  },
  content_reminder_text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    color: 'white',
  },
  content_description_text: {
    fontSize: 16,
    marginTop: 16,
    color: 'white',
  },
  content_title_text: {
    alignSelf: 'center',
    textAlign: 'center',
    fontStyle: 'normal',
    fontSize: 25,
    lineHeight: 30,
    marginTop: 16,
    marginHorizontal: 16,
    color: 'white',
  },
  icon: {
    alignSelf: 'center',
  },
  button_container: {
    flex: 1,
    width: '100%',
    marginBottom: 32,
  },
  finish_button: {
    borderRadius: 4,
    flexDirection: 'column',
    paddingVertical: 18,
    marginVertical: 48,
    marginHorizontal: 24,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    alignItems: 'center',
    backgroundColor: 'white',
  },
  finish_button_text: {
    color: colors.primary_theme,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
  },
});

ThankYou.propTypes = {
  updateFTUE: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({updateFTUE}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(ThankYou);
