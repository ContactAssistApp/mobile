import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import colors from 'assets/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Checkbox from './Checkbox';

class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: false,
    };
  }

  toggleExpand = () => {
    this.setState({expanded: !this.state.expanded});
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.toggleExpand()}>
          <View style={styles.checkbox_wrapper}>
            {this.props.withCheckbox && (
              <Checkbox
                text={''}
                onPress={this.props.onPress}
                selected={this.props.checkboxSelected}
              />
            )}
            <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
          </View>
          <Icon
            name={
              this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
            }
            color={colors.gray_icon}
            size={24}
          />
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {this.state.expanded && (
          <View style={styles.child}>{this.props.children}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    lineHeight: 24,
  },
  checkbox_wrapper: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 20,
    paddingRight: 18,
    alignItems: 'center',
  },
  parentHr: {
    height: 1,
    width: '100%',
  },
  child: {
    paddingHorizontal: 25,
  },
});

export default Accordion;
