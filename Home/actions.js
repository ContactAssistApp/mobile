export function addBLE(device) {
  return {
    type: 'ADD_BLE',
    device,
  };
}

export function startScan() {
  return (dispatch, getState, DeviceManager) => {
    const subscription = DeviceManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        dispatch(scan());
        subscription.remove();
      }
    }, true);
  };
}

export function scan() {
  return (dispatch, getState, DeviceManager) => {
    DeviceManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }

      if (device !== null) {
        dispatch(addBLE(device));
      }
    });
  };
}
// export function runExperiments(payload) {
//   return (dispatch) => {
//     const tasksUrl = `${BASE_URL}/tasks`;
//     const requestBody = {
//       payload
//     };
//
//     dispatch(runExperimentsStart());
//     fetch(tasksUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(requestBody)
//     })
//     .then((response) => {
//       if (!response.ok) {
//         response.text().then((error) => {
//           dispatch({type: types.ADD_ERROR, error});
//           return;
//         })
//       }
//       dispatch(runExperimentsSuccess());
//     })
//     .catch(err => {
//       dispatch({type: types.ADD_ERROR, error: err});
//     });
//   };
// }
