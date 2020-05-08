import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from '../assets/colors';
import CustomIcon from '../assets/icons/CustomIcon.js';
import ImportGoogleTimeline from '../GoogleTimeline/ImportGoogleTimeline';

class Import extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    };
  }

  render() {
    return (
      <>
        <ImportGoogleTimeline
          visible={this.state.visible}
          handleModalClose={() => {
            this.setState({visible: false});
          }}
        />
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.setState({visible: true})}>
          <CustomIcon
            name={'import24'}
            color={colors.gray_icon}
            size={16}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.title}>Import Location History</Text>
            <Text style={styles.description}>
              Sync your location history directly from Google by importing your timeline data.
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 19,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.body_copy,
    paddingBottom: 5,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
  },
});

export default Import;
