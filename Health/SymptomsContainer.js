import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import colors from '../assets/colors';
import SymptomTracker from '../SymptomTracker/SymptomTracker';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import CustomIcon from '../assets/icons/CustomIcon.js';

class SymptomsContainer extends Component {
  constructor() {
    super();
    this.agendaRef = React.createRef();
    this.state = {
      date: 'Wednesday, April 23',
      calendarExpand: false,
    };
  }

  toggleCalendar = () => {
    if (!this.state.calendarExpand) {
      this.agendaRef.current.setScrollPadPosition(0, true);
      this.agendaRef.current.enableCalendarScrolling();
      this.setState({
        calendarExpand: true,
      });
    } else {
      this.agendaRef.current.setScrollPadPosition(
        this.agendaRef.current.initialScrollPadPosition(),
        true,
      );
      this.agendaRef.current.setState({
        calendarScrollable: false,
      });
      this.agendaRef.current.calendar.scrollToDay(
        this.agendaRef.current.state.selectedDay.clone(),
        this.agendaRef.current.calendarOffset(),
        true,
      );
      this.setState({
        calendarExpand: false,
      });
    }
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.date}>{this.state.date}</Text>
          <TouchableOpacity
            style={styles.calendar_button}
            onPress={this.toggleCalendar}>
            <CustomIcon
              name={'calendar24'}
              color={
                this.state.calendarExpand
                  ? colors.primary_theme
                  : colors.gray_icon
              }
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Agenda
          ref={this.agendaRef}
          pastScrollRange={0}
          futureScrollRange={0}
          hideKnob={true}
          renderEmptyData = {() => {return (<SymptomTracker/>)}}
          // markedDates={{
          //   '2020-04-25': {selected: true, marked: true},
          // }}
          theme={{
            selectedDayTextColor: colors.primary_theme,
            selectedDayBackgroundColor: colors.fill_on,
            dayTextColor: colors.secondary_body_copy,
            dotColor: '#ACACAC',
            selectedDotColor: colors.primary_theme,
          }}
        />
        <SymptomTracker />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
  },
  calendar_button: {
    width: 35,
    alignItems: 'center',
  },
});

export default SymptomsContainer;
