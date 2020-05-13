import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Symptoms from './Symptoms';
import Report from './Report';
import colors from '../assets/colors';
import CustomIcon from '../assets/icons/CustomIcon.js';
import Calendar from '../views/Calendar';
import TabView from '../views/TabView';
import DateConverter from '../utils/date';

class Health extends PureComponent {
  constructor() {
    super();
    this.state = {
      date: DateConverter.calendarFormat(new Date()),
      weekView: true,
      markedDates: {},
    };
  }

  render() {
    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <View style={styles.title_container}>
            <Image
              style={styles.logo}
              source={require('../assets/home/logo.png')}
            />
            <Text style={styles.title}>Health Report[DEMO]</Text>
          </View>
          <TouchableOpacity
            style={styles.calendar_button}
            onPress={() => {
              this.updateCalendarState();
            }}>
            <CustomIcon
              name={'calendar24'}
              color={
                !this.state.weekView ? colors.primary_theme : colors.gray_icon
              }
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Calendar
          current={this.state.date}
          markedDates={this.state.markedDates}
          handleDayPress={day => {
            this.setState({
              date: day.dateString,
              weekView: true,
            });
          }}
          weekView={this.state.weekView}>
          <TabView>
            <Symptoms
              tabLabel={'symptoms'}
              navigate={this.props.navigation.navigate}
            />
            <Report tabLabel={'diagnosis'} />
          </TabView>
        </Calendar>
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
    justifyContent: 'space-between',
  },
  title_container: {
    flexDirection: 'row',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  title: {
    fontSize: 24,
    color: colors.section_title,
    fontWeight: '500',
  },
});

export default Health;
