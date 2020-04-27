import Foundation
import CoreLocation
import Contacts

@objc(Locations)
class Locations: NSObject {
  private var count = 0
  
  @objc
  func increment() {
    count += 1
    print("count is \(count)")
  }
  
  @objc
  func getCount(_ callback: RCTResponseSenderBlock) {
    callback([count])
  }

  struct AddressTS : Codable {
    let address : String
    let timestamp: Double
  }

  struct AddressPeriod : Codable {
    let address: String
    let period: String
  }
  
  @objc
  func reverseGeoCode(_ geoList:[NSDictionary], callback: @escaping RCTResponseSenderBlock) {
    // Fire an asynchronous callback when all your requests finish in synchronous.
    let asyncGroup = DispatchGroup()
    var placeList: [AddressTS] = [AddressTS](repeating: AddressTS(address:"",timestamp:0), count: geoList.count)  //List of AddressTS
    for (index, geo) in geoList.enumerated() {
      let lat = geo.value(forKey: "latitude") as! Double
      let lon = geo.value(forKey: "longitude") as! Double
      let timestamp = geo.value(forKey: "time") as! Double

      asyncGroup.enter()
      // Reverse Geocoding With Clgeocoder
      let gecoder = CLGeocoder.init()

      gecoder.reverseGeocodeLocation(CLLocation.init(latitude:lat,longitude:lon)) {(addresses, error) in
        if error == nil {
          if let address = addresses{
            //Async: Here you can get all the info by combining that you can make address!
            var addressString = ""
            if #available(iOS 11.0, *) {
              addressString = CNPostalAddressFormatter.string(from:address[0].postalAddress!, style: .mailingAddress)
            } else {
              if let lines = address[0].addressDictionary?["FormattedAddressLines"] as? [String] {
                addressString = lines.joined(separator: ", ")
              }
            }

            //async - sequential reserved - fixed size
            placeList[index] = AddressTS(address: addressString, timestamp: timestamp)
            asyncGroup.leave()
          }
        }
      }
    }

    asyncGroup.notify(queue: .main) {
      print("Finished the loop - find \(geoList.count) addresses")
      let results = self.aggregateAddressList(addressTSList: placeList)
      callback([results])
    }
  }

  /// UTC time converter
  func UTC_Converter(unixtime1: Double, unixtime2: Double, timezone: String? = nil) -> String {
    // Localization
    var localTimeZoneAbbreviation: String { return TimeZone.current.abbreviation() ?? "" } // "UTC-4"
    let date1 = Date(timeIntervalSince1970: unixtime1)
    let date2 = Date(timeIntervalSince1970: unixtime2)
    let dateFormatter = DateFormatter()
    // Set timezone that you want: i.e. New York is "UTC-4"
    dateFormatter.timeZone = TimeZone(abbreviation: timezone ?? localTimeZoneAbbreviation)
    dateFormatter.locale = NSLocale.current
    dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss" // Specify format that you want
    let strDate1 = dateFormatter.string(from: date1)
    let strDate2 = dateFormatter.string(from: date2)
    return (strDate1 + "~" + strDate2)
  }
  

  //---------------------------------------------------------------------------------
  // MARK: - Step2: aggregate address result - from timestamp to period
  //---------------------------------------------------------------------------------
  func aggregateAddressList(addressTSList: [AddressTS]) -> [String] {
    var AddressPeriodList: [AddressPeriod] = []  // List of AddressPeriod
    var start: Double = 0 // UTC start
    var end: Double = 0 // UTC end
    var address = "" // address pointer
    for (index, address_ts) in addressTSList.enumerated() {
      if index == 0 { // first one
        start = address_ts.timestamp
        end = address_ts.timestamp
        address = address_ts.address
      } else if address_ts.address != address {
        // append - dynamic size
        // logic: same location + 10min
        if start == end {
          AddressPeriodList.append(AddressPeriod(address:address,period: UTC_Converter(unixtime1:start,unixtime2:(start+600))))
        } else {
          AddressPeriodList.append(AddressPeriod(address:address,period: UTC_Converter(unixtime1:start,unixtime2:end)))
        }
        // update
        start = address_ts.timestamp
        end = address_ts.timestamp
        address = address_ts.address
        if index == addressTSList.indices.last { // last one - unique, add extra
          // logic: same location + 10min
          AddressPeriodList.append(AddressPeriod(address:address_ts.address, period: UTC_Converter(unixtime1:start,unixtime2:(start+600))))
        }
      } else { // move on
        end = address_ts.timestamp
        if index == addressTSList.indices.last { // last one - same, add extra
          // logic: same location + 10min
          if start == end {
            AddressPeriodList.append(AddressPeriod(address:address, period: UTC_Converter(unixtime1:start,unixtime2:(start+600))))
          } else {
            AddressPeriodList.append(AddressPeriod(address:address, period: UTC_Converter(unixtime1:start,unixtime2:end)))
          }
        }
      }
    }

    let addresses = Set(AddressPeriodList.lazy // include unique
      .map { $0.address }
      .filter { !$0.isEmpty } // where it's not equal to ""
    )
    return Array(addresses)
  }
}
