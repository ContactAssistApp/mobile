import React, {Component} from 'react';
import PropTypes from 'prop-types';
import colors from '../assets/colors';
import {Agenda} from 'react-native-calendars';

class Calendar extends Component {
  constructor(props) {
    super();
    this.contactAgendaRef = React.createRef();
    this.state = {
      calendarExpanded: props.calendarExpanded,
    };
  }

  componentDidUpdate(prevProps) {
    const {calendarExpanded} = this.props;

    if (prevProps.calendarExpanded !== calendarExpanded) {
      this.toggleCalendar();
    }
  }

  toggleCalendar = () => {
    if (!this.state.calendarExpanded) {
      this.contactAgendaRef.current.setScrollPadPosition(0, true);
      this.contactAgendaRef.current.enableCalendarScrolling();
      this.setState({
        calendarExpanded: true,
      });
    } else {
      this.contactAgendaRef.current.setScrollPadPosition(
        this.contactAgendaRef.current.initialScrollPadPosition(),
        true,
      );
      this.contactAgendaRef.current.setState({
        calendarScrollable: false,
      });
      this.contactAgendaRef.current.calendar.scrollToDay(
        this.contactAgendaRef.current.state.selectedDay.clone(),
        this.contactAgendaRef.current.calendarOffset(),
        true,
      );
      this.setState({
        calendarExpanded: false,
      });
    }
  };

  render() {
    const {markedDates} = this.props;
    return (
      <Agenda
        ref={this.contactAgendaRef}
        hideKnob={true}
        markedDates={markedDates}
        onDayPress={day => {
          this.props.handleDayPress(day);
        }}
        renderEmptyData={() => {
          return this.props.children;
        }}
        theme={{
          selectedDayTextColor: colors.primary_theme,
          selectedDayBackgroundColor: colors.fill_on,
          dayTextColor: colors.secondary_body_copy,
          todayTextColor: colors.secondary_body_copy,
          dotColor: '#ACACAC',
          selectedDotColor: colors.primary_theme,
        }}
      />
    );
  }
}

Calendar.defaultProps = {
  markedDates: {},
};

Calendar.propTypes = {
  markedDates: PropTypes.object,
};

export default Calendar;
