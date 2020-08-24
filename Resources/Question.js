import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import CustomIcon from 'assets/icons/CustomIcon.js';
import PropTypes from 'prop-types';
import colors from 'assets/colors';

class Question extends Component {
  render() {
    const {question} = this.props;
    return (
      <TouchableOpacity style={styles.row} onPress={this.props.handleOnPress}>
        <Text style={styles.question}>{question}</Text>
        <CustomIcon
          name={'chevron24'}
          color={colors.gray_icon}
          size={24}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.gray_icon,
    flex: 9,
  },
  icon: {
    transform: [{rotate: '90deg'}],
    flex: 1,
  },
});

Question.propTypes = {
  question: PropTypes.string.isRequired,
  handleOnPress: PropTypes.func.isRequired,
};

export default Question;
