import React, {Component} from 'react';
import {Button, Text} from 'react-native';
import {connect} from 'react-redux';
import {startScan} from './actions.js';
import {bindActionCreators} from 'redux';
import LocationServices from './LocationServices';
import AsyncStorage from '@react-native-community/async-storage';
import Ble from '../ble/ble';

//active contact means we reached out and read the ID of device
const CONTACT_ACTIVE = 1;
//active contact means a device reached out to us and send their ID
const CONTACT_PASSIVE = 2;


class HomeContainer extends Component {
  constructor() {
    super();
    this.state = {
      record: 0,
      isBleEnabled: false,
      theSeed: {},
      queryResult: ''
    };
  }

  componentDidMount() {
  }

  trackGPS = () => {
    LocationServices.start();
  };

  stopTrackGPS = () => {
    LocationServices.stop();
  };

  exportGPS = () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log(JSON.parse(result[1]).length);
          this.setState({
            record: JSON.parse(result[1]).length,
          });
        });
      });
    });
  };

  clearAsyncStorage = async() => {
    AsyncStorage.clear();
  };

  componentWillUnmount() {
  }

  startBle = () => {
    Ble.start();
    this.setState({ isBleEnabled: true });
  }

  stopBle = () => {
    Ble.stop();
    this.setState({ isBleEnabled: false });
  }

  getDeviceSeedAndRotate = () => {
    //14 days ago
    Ble.getDeviceSeedAndRotate(24 * 14 * 3600).then(
      result => {
        console.log("I got: " + JSON.stringify(result));
        this.setState({ theSeed: JSON.stringify(result) });
      },
      error => {
        console.log("failed eth: " + error);
        this.setState({ theSeed: error.message });
      });
  }

  runQuery = () => {

    //input is array of `BluetoothMatch`

    var inputArray = [] //plug proto here
    args = []
    msgs = []
    for(var match in inputArray) {
      msgs.push(match.user_message);
      seeds = []
      timestamps = []
      for(var bm in match.seeds) {
        seeds.push(bm.seed);
        timestamps.push(bm.sequence_start_time);
      }
      args.push(seeds);
      args.push(timestamps);
    }


    args = [
      ['111-333-444', '1a320ba1'],
      [10247392, 19372910],
      ['111-333-444', '73733-a132e'],
      [10247392, 1372910],
    ];

    msgs = [
      "First message",
      "Second message"
    ]


    Ble.runBleQuery(args).then(
      result => {
        res = ''
        for(var i = 0; i < result.length; ++i) {
          if(result[i] == 1)
            res += msgs[i] + "\n";
        }
        if(res == '')
          res = "All good!";

        this.setState({ queryResult: res});
      },
      error => {
        this.setState({ queryResult: "Didn't work"});
      }
    )
  }

  countLogs = (kind) => {
    var count = 0;
    this.state.contactLogs.forEach(log => {
      if(kind == log.kind)
        ++count;
    });
    return count.toString();
  }

  render() {
    return (
      <>
        <Text></Text><Text></Text><Text></Text><Text></Text><Text></Text><Text></Text>
        <Text>                This the debug help page, have fun!</Text>
        <Button title={'Start BLE'} onPress={this.startBle} />
        <Button title={'Stop BLE'} onPress={this.stopBle} />
        <Button title={'GetSeed'} onPress={this.getDeviceSeedAndRotate} />
        <Button title={'RunQuery'} onPress={this.runQuery} />

        <Button title={'Track GPS'} onPress={this.trackGPS} />
        <Button title={'Stop Track GPS'} onPress={this.stopTrackGPS} />
        <Button title={'Export gps'} onPress={this.exportGPS} />
        <Button title={'clear storage'} onPress={this.clearAsyncStorage} />

        <Text>{this.state.record}</Text>
        <Text>Bluetooth: {this.state.isBleEnabled.toString()}</Text>
        <Text>QUERY RESULT: {this.state.queryResult}</Text>
        <Text>{JSON.stringify(this.state.theSeed)}</Text>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    bleData: state.homeReducer,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  startScan,
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);
// export default HomeContainer