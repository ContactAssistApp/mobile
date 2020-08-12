import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GetStoreData} from 'utils/asyncStorage';
import FTUE from './OnBoarding/FTUE';
import Preferences from './OnBoarding/Preferences';
import BottomNav from './BottomNav';
import SymptomForm from 'SymptomTracker/SymptomForm';
import colors from 'assets/colors';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {updateFTUE} from './actions.js';
import {strings} from 'locales/i18n';

const Stack = createStackNavigator();

class AppNav extends Component {
  constructor() {
    super();
    this.state = {
      statusFetched: false,
    };
  }

  componentDidMount() {
    this.getEnableFTUE().then(enableFTUE => {
      if (enableFTUE) {
        this.props.updateFTUE({
          field: 'enableFTUE',
          value: enableFTUE,
        });
      }

      this.setState({
        statusFetched: true,
      });
    });
  }

  getEnableFTUE = () => {
    return GetStoreData('ENABLE_FTUE').then(val => {
      return val;
    });
  };

  render() {
    const {statusFetched} = this.state;
    const {enableFTUE} = this.props.navStatus;

    return (
      <>
        {statusFetched
        ? <NavigationContainer>
            <Stack.Navigator>
              {enableFTUE === 'true' && (
                <Stack.Screen
                  name={'FTUE'}
                  component={FTUE}
                  options={{
                    title: '',
                    headerStyle: {height: 0},
                  }}
                />
              )}
              {enableFTUE === 'true' && (
                <Stack.Screen
                  name={'Preferences'}
                  component={Preferences}
                  options={{
                    title: strings('permissions.header_text'),
                    headerTintColor: colors.primary_theme,
                    headerBackTitle: ' ',
                  }}
                />
              )}
              <Stack.Screen
                name="BottomNav"
                component={BottomNav}
                options={{
                  title: '',
                  headerStyle: {height: 0},
                  // headerBackTitle: '',
                }}
              />
              <Stack.Screen
                name="SymptomForm"
                component={SymptomForm}
                options={{
                  title: strings('add.symptoms_header_text'),
                  // headerStyle: {height: 0},
                  // headerBackTitle: '',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        : <View style={styles.loading_spinner}>
            <ActivityIndicator size={'large'} color={colors.primary_theme} />
          </View>
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  loading_spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

AppNav.propTypes = {
  updateFTUE: PropTypes.func.isRequired,
};

// reducer
const mapStateToProps = state => {
  return {
    navStatus: state.navReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateFTUE
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppNav);
