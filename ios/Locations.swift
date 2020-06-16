import Foundation
import CoreLocation
// Limit use of Contacts framework
import class Contacts.CNPostalAddressFormatter

@objc(Locations)
class Locations: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func reverseGeoCode(
    _ geo: NSDictionary,
    resolve resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    let lat = geo.value(forKey: "latitude") as! Double
    let lon = geo.value(forKey: "longitude") as! Double
    let geocoder = CLGeocoder()

    geocoder.reverseGeocodeLocation(CLLocation(latitude: lat, longitude: lon)) { (addresses, error) in
      if error == nil, let address = addresses?.first {
          var addressString = ""
          if #available(iOS 11.0, *) {
            addressString = CNPostalAddressFormatter
              .string(from: address.postalAddress!, style: .mailingAddress)
              .replacingOccurrences(of: "\n", with: ", ")
          } else {
            if let lines = address.addressDictionary?["FormattedAddressLines"] as? [String] {
              addressString = lines.joined(separator: ", ")
            }
          }
          let res: [String: String] = [
            "name": address.name ?? "",
             "address": addressString
          ];
          resolve(res);
      } else {
        reject("GEOCODER_ERROR", "ReverseGeoCode failure", error);
      }
    }
  }

}
