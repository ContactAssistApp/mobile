
package com.covidsafe;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;
import java.util.List;
import java.util.HashMap;

import android.content.Context;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.os.AsyncTask;
import android.util.Log;

public class LocationsModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  LocationsModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "Locations";
  }

  private static final String E_GEOCODER_NOT_PRESET = "E_GEOCODER_NOT_PRESET";
  private static final String E_GEOCODER_EXCEPTION = "E_GEOCODER_EXCEPTION";

  class AsyncGpsTask extends AsyncTask<Void, Void, Void>
  {
    private final Promise promise;
    private final double lat, lon;
    private final Context context;

    AsyncGpsTask(Context context, double lat, double lon, Promise promise){
        this.context = context;
        this.lat = lat;
        this.lon =  lon;
        this.promise = promise;
    }

    @Override
    protected Void doInBackground(Void... voids) {
        try {
            final Geocoder gc = new Geocoder(this.context);
            if (gc.isPresent()) {
                double latitude = this.lat;
                double longitude = this.lon;
                List<Address> addresses = gc.getFromLocation(latitude, longitude, 1);
                if(addresses.size() == 0) {
                    promise.resolve(null);
                    return null;
                }

                Address address = addresses.get(0);
                WritableMap res = Arguments.createMap();
                res.putString("name", address.getFeatureName());
                res.putString("address", address.getAddressLine(0));
                promise.resolve(res);
          } else {
                promise.reject(E_GEOCODER_NOT_PRESET, "Geocoder not present");
          }
        } catch(Exception e) {
            promise.reject(E_GEOCODER_EXCEPTION, "Geocode failed with: " + e.toString());
        }
        return null;
      }
  }

  @ReactMethod
  public void reverseGeoCode(ReadableMap location, Promise promise) {
      double lat = location.getDouble("latitude");
      double lon = location.getDouble("longitude");
      new AsyncGpsTask(reactContext.getBaseContext(), lat, lon, promise).execute();
  }
}