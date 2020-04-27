import Foundation
import CoreLocation
// Limit use of Contacts framework
import class Contacts.CNPostalAddressFormatter

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

  struct AddressTS: Codable {
    let address: String
    let timestamp: Double
  }

  struct AddressPeriod: Codable {
    let address: String
    let period: String
  }
  
  @objc
  func reverseGeoCode(_ geoList: [NSDictionary], callback: @escaping RCTResponseSenderBlock) {
    // Fire an asynchronous callback when all your requests finish in synchronous.
    let asyncGroup = DispatchGroup()
    // List of AddressTS
    var placeList = [AddressTS](repeating: AddressTS(address: "", timestamp: 0), count: geoList.count)
    for (index, geo) in geoList.enumerated() {
      let lat = geo.value(forKey: "latitude") as! Double
      let lon = geo.value(forKey: "longitude") as! Double
      let timestamp = geo.value(forKey: "time") as! Double

      asyncGroup.enter()
      // Reverse Geocoding With CLGeocoder
      let gecoder = CLGeocoder()

      gecoder.reverseGeocodeLocation(CLLocation(latitude: lat, longitude: lon)) { (addresses, error) in
        if error == nil, let address = addresses?.first {
          // Async: Here you can get all the info by combining that you can make address!
          var addressString = ""
          if #available(iOS 11.0, *) {
            addressString = CNPostalAddressFormatter
              .string(from: address.postalAddress!, style: .mailingAddress)
          } else {
            if let lines = address.addressDictionary?["FormattedAddressLines"] as? [String] {
              addressString = lines.joined(separator: ", ")
            }
          }

          // async - sequential reserved - fixed size
          placeList[index] = AddressTS(address: addressString, timestamp: timestamp)
          asyncGroup.leave()
        }
      }
    }

    asyncGroup.notify(queue: .main) {
      print("Finished the loop - find \(geoList.count) addresses")
      let results = self.aggregateAddressList(addressTSList: placeList)
      callback([results])
    }
  }

  // MARK: - Formatting Time

  /// UTC time converter
  func UTC_Converter(unixtime1: Double, unixtime2: Double, timezone: String? = nil) -> String {
    // Localization
    let date1 = Date(timeIntervalSince1970: unixtime1)
    let date2 = Date(timeIntervalSince1970: unixtime2)
    let dateFormatter = makeDateFormatter(inTimezone: timezone)
    let strDate1 = dateFormatter.string(from: date1)
    let strDate2 = dateFormatter.string(from: date2)
    return (strDate1 + "~" + strDate2)
  }

  /// It's actually an expensive operation to create date formatters.
  private func makeDateFormatter(inTimezone timezone: String?) -> DateFormatter {
    guard let timezone = timezone else { return formatter }
    let dateFormatter = DateFormatter()
    // Set timezone that you want: i.e. New York is "UTC-4"
    dateFormatter.timeZone = TimeZone(abbreviation: timezone)
    dateFormatter.locale = NSLocale.current
    dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss" // Specify format that you want
    return dateFormatter
  }

  /// Therefore caches the formatter for default (current) timezone
  private lazy var formatter: DateFormatter = {
    // e.g. "UTC-4"
    return makeDateFormatter(inTimezone: localTimeZoneAbbreviation)
  }()

  @objc
  private func updateDefaultFormatter() {
    formatter = makeDateFormatter(inTimezone: localTimeZoneAbbreviation)
  }

  private var localTimeZoneAbbreviation: String {
    return TimeZone.current.abbreviation() ?? ""
  }

  override init() {
    super.init()
    /// Updates date formatter when timezone changes
    NotificationCenter.default
      .addObserver(self, selector: #selector(updateDefaultFormatter),
                   name: .NSSystemTimeZoneDidChange, object: nil)
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }

  //---------------------------------------------------------------------------------
  // MARK: - Step2: aggregate address result - from timestamp to period
  //---------------------------------------------------------------------------------
  func aggregateAddressList(addressTSList: [AddressTS]) -> [String] {
    guard let first = addressTSList.first else { return [] }

    var AddressPeriodList: [AddressPeriod] = []  // List of AddressPeriod
    var start: Double = first.timestamp // UTC start
    var end: Double = first.timestamp // UTC end
    var address = first.address // address pointer

    /// Add an adress and the stay interval to adress list. `end` defaults to start + 10 minutes.
    func appendAddress(_ address: String, startingAt start: Double, to end: Double? = nil) {
      let end = end ?? start + 600
      AddressPeriodList.append(AddressPeriod(
        address: address,
        period: UTC_Converter(unixtime1: start, unixtime2: end)
      ))
    }

    for (index, address_ts) in addressTSList.enumerated().dropFirst() {
      if address_ts.address != address {
        // append - dynamic size
        if start == end {
          // logic: same location + 10min
          appendAddress(address, startingAt: start)
        } else {
          appendAddress(address, startingAt: start, to: end)
        }
        // update
        start = address_ts.timestamp
        end = address_ts.timestamp
        address = address_ts.address
        if index == addressTSList.indices.last { // last one - unique, add extra
          // logic: same location + 10min
          appendAddress(address_ts.address, startingAt: start)
        }
      } else { // move on
        end = address_ts.timestamp
        if index == addressTSList.indices.last { // last one - same, add extra
          if start == end {
            // logic: same location + 10min
            appendAddress(address, startingAt: start)
          } else {
            appendAddress(address, startingAt: start, to: end)
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
