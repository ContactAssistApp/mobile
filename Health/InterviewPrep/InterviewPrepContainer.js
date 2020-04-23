import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../../assets/colors';
import Symptoms from './Symptoms';
import Locations from './Locations';
import People from './People';
import Summary from './Summary';
import StepIndicatorContainer from './StepIndicatorContainer';
import CustomIcon from '../../assets/icons/CustomIcon.js';

class InterviewPrepContainer extends Component {
  constructor() {
    super();
    this.state = {
      index: 0,
    };
  }

  render() {
    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <TouchableOpacity onPress={this.props.handleModalClose}>
            <CustomIcon name={'close24'} color={colors.gray_icon} size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Interview preparation</Text>
        </View>
        <ScrollView>
          <StepIndicatorContainer index={this.state.index} />
          {
            {
              0: <Symptoms />,
              1: <Locations />,
              2: <People />,
              3: <Summary />,
            }[this.state.index]
          }
          <View style={styles.button_group}>
            {this.state.index < 3 && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.setState({
                    index: this.state.index + 1,
                  });
                }}>
                <Text style={styles.button_text}>next</Text>
              </TouchableOpacity>
            )}
            {this.state.index === 3 && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {

                }}>
                <Text style={styles.button_text}>save</Text>
              </TouchableOpacity>
            )}
            {this.state.index > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.previous]}
                onPress={() => {
                  this.setState({
                    index: this.state.index - 1,
                  });
                }}>
                <Text style={[styles.button_text, styles.previous_text]}>
                  previous
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  status_bar: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    alignItems: 'center',
  },
  title: {
    paddingLeft: 20,
    fontSize: 24,
    color: colors.section_title,
    fontWeight: '500',
  },
  button: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
  },
  button_text: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: 'white',
    textTransform: 'uppercase',
  },
  button_group: {
    padding: 20,
  },
  previous: {
    backgroundColor: colors.card_border,
  },
  previous_text: {
    color: colors.section_title,
  }
});

export default InterviewPrepContainer;
