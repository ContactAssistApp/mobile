import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import colors from '../assets/colors';
import Locations from './Locations';
import People from './People';
import {Agenda} from 'react-native-calendars';
import CustomIcon from '../assets/icons/CustomIcon.js';
import {updateDate} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class ContactLog extends Component {
  constructor() {
    super();
    this.contactAgendaRef = React.createRef();
    this.state = {
      index: 0,
      routes: [
        {key: 'locations', title: 'locations'},
        {key: 'people', title: 'people'},
      ],
      calendarExpand: false,
      markedDates: {},
    };
  }

  toggleCalendar = () => {
    if (!this.state.calendarExpand) {
      this.contactAgendaRef.current.setScrollPadPosition(0, true);
      this.contactAgendaRef.current.enableCalendarScrolling();
      this.setState({
        calendarExpand: true,
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
        calendarExpand: false,
      });
    }
  };

  render() {
    const locationsRoute = () => {
      return <Locations />;
    };
    const peopleRoute = () => <People />;
    const initialLayout = {width: Dimensions.get('window').width};

    const renderScene = SceneMap({
      locations: locationsRoute,
      people: peopleRoute,
    });

    const renderTabBar = props => (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: colors.primary_theme}}
        style={styles.tab_bar}
        activeColor={colors.section_title}
        inactiveColor={colors.gray_icon}
      />
    );

    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <View style={styles.title_container}>
            <Image
              style={styles.logo}
              source={require('../assets/home/logo.png')}
            />
            <Text style={styles.title}>Contact Log</Text>
          </View>
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
          ref={this.contactAgendaRef}
          pastScrollRange={1}
          futureScrollRange={1}
          hideKnob={true}
          markedDates={this.state.markedDates}
          onDayPress={day => {
            this.setState({
              calendarExpand: false,
            });
            this.props.updateDate({
              field: 'date',
              value: new Date(day.dateString),
            });
          }}
          renderEmptyData={() => {
            return (
              <TabView
                navigationState={this.state}
                renderTabBar={renderTabBar}
                renderScene={renderScene}
                onIndexChange={idx => {
                  this.setState({index: idx});
                }}
                initialLayout={initialLayout}
              />
            );
          }}
          theme={{
            selectedDayTextColor: colors.primary_theme,
            selectedDayBackgroundColor: colors.fill_on,
            dayTextColor: colors.secondary_body_copy,
            todayTextColor: colors.secondary_body_copy,
            dotColor: '#ACACAC',
            selectedDotColor: colors.primary_theme,
          }}
          style={styles.agenda}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  tab_bar: {
    backgroundColor: 'white',
  },
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

ContactLog.propTypes = {
  updateDate: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateDate
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(ContactLog);
