import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import colors from '../assets/colors';

class ContactLog extends Component {
  render() {
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView>
        <Text>Contact log</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

});

export default ContactLog;
