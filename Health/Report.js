import React, {PureComponent} from 'react';
import {REPORT_BLE_URL} from '../utils/endpoints';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Linking,
} from 'react-native';
import {getLatestCoarseLocation} from '../utils/coarseLocation';
import colors from '../assets/colors';
import Ble from '../utils/ble';
import PrepareInterviewComponent from '../InterviewPrep/PrepareInterviewComponent';
import {UW_URL} from '../utils/constants';
import Emergency from '../Privacy/Emergency';
import CareTips from '../CareTips/CareTips';
import ResourcesComponent from '../ResourcesComponent/ResourcesComponent';
import {strings} from '../locales/i18n';

class Report extends PureComponent {
  constructor() {
    super();
    this.state = {
      uploadBLESuccess: false,
    };
  }

  uploadBLE = () => {
    let seeds;
    this.getDeviceSeedAndRotate().then(data => {
      seeds = data.map(seed => {
        return {
          seed: seed.seed,
          sequenceEndTime: seed.sequenceEndTime * 1000,
          sequenceStartTime: seed.sequenceStartTime * 1000,
        };
      });
      getLatestCoarseLocation(true).then(location => {
        if (location) {
          this.reportBLE(seeds, location);
        }
        // TODO: handle null case
      });
    });
  };

  reportBLE = (seeds, location) => {
    const requestBody = {
      "seeds": seeds,
      "region": {
        "latitudePrefix": location.latitudePrefix,
        "longitudePrefix": location.longitudePrefix,
        "precision": location.precision
      }
    };

    fetch(REPORT_BLE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        if (!response.ok) {
          response.json().then(err => {
            console.log(err);
            return;
          });
        }
        this.setState({
          uploadBLESuccess: true,
        });
        return;
      })
      .catch(err => {
        console.log(err);
      });
  };

  getDeviceSeedAndRotate = () => {
    //14 days ago
    return Ble.getDeviceSeedAndRotate(24 * 14 * 3600).then(
      result => {
        console.log('I got: ' + JSON.stringify(result));
        return result;
      },
      error => {
        console.log('failed eth: ' + error);
      },
    );
  };

  render() {
    return (
      <ScrollView>
        <Image
          style={styles.hero}
          source={require('../assets/health/report_bg.png')}
        />
        <View style={styles.result_container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.uploadBLE()}>
            <Text style={styles.button_text}>{strings("submit.your_report_button_text")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.learn_more]}
            onPress={() =>
              Alert.alert(
                strings('warning.header_text'),
                strings('confirm.diagnosis'),
                [
                  {
                    text: strings('global.privacyText'),
                    onPress: () => {
                      Linking.openURL(UW_URL);
                    },
                  },
                  {
                    text: strings('global.ok'),
                    style: 'cancel'
                  },
                ],
                {cancelable: false}
              )}>
            <Text style={[styles.button_text, styles.learn_more_text]}>
              {strings("what.happen_when_i_submit_report")}
            </Text>
          </TouchableOpacity>
          {this.state.uploadBLESuccess && <Text>{strings('pos.text')}</Text>}
        </View>
        <Text style={styles.header}>{strings('next.steps_text')}</Text>
        <PrepareInterviewComponent />
        <Emergency />
        <CareTips />
        <ResourcesComponent />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 104,
  },
  result_container: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: 0.33,
  },
  button: {
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  learn_more: {
    backgroundColor: 'white',
    borderColor: colors.card_border,
    borderWidth: 1,
  },
  button_text: {
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
  },
  learn_more_text: {
    color: colors.primary_theme,
  },
  header: {
    fontSize: 20,
    lineHeight: 26,
    textTransform: 'capitalize',
    color: colors.module_title,
    margin: 15,
    marginTop: 25,
  },
});

export default Report;
