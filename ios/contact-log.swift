/// --------------------------------------------------------------------------
///
///
///                                 CovidSafe
///
///
/// ------------------------ Coordinate <> Locationm   ------------------------
import MapKit
import CoreLocation

// Draw on the map - test in playground
func drawMap(lat:Double,lon:Double,address:CLPlacemark){
    //--------------------- Draw on the map -----------------
    let appleParkWayCoordinates = CLLocationCoordinate2DMake(lat, lon)
    // Now let's create a MKMapView
    let mapView = MKMapView(frame: CGRect(x:0, y:0, width:800, height:800))
    // Define a region for our map view
    var mapRegion = MKCoordinateRegion()
    let mapRegionSpan = 0.02
    mapRegion.center = appleParkWayCoordinates
    mapRegion.span.latitudeDelta = mapRegionSpan
    mapRegion.span.longitudeDelta = mapRegionSpan
    mapView.setRegion(mapRegion, animated: true)
    // Create a map annotation
    let annotation = MKPointAnnotation()
    annotation.coordinate = appleParkWayCoordinates
    annotation.title = address.name! //Buiness name? Google API place likelyhood.
    annotation.subtitle = address.compactAddress!
    mapView.addAnnotation(annotation)
    // Add the created mapView to our Playground Live View
    PlaygroundPage.current.liveView = mapView
    //--------------------------------------
}

//Test input example:
let lat = 40.75
let lon = -73.98
var placeList: [CLPlacemark] = []  //List of CLPlacemarks

//Batch input example:
struct Geo : Codable {
    let lat : Double
    let lon : Double
    let timestamp: Double
}

struct AddressTS : Codable {
    let address : String
    let timestamp: Double
}

struct AddressPeriod : Codable {
    let address: String
    let period: String
}

//input type 1 example
let geoList = [Geo(lat:40.75,lon:-73.98,timestamp:1587749400),
               Geo(lat:40.75,lon:-73.98,timestamp:1587751200),
               Geo(lat:40.76,lon:-73.99,timestamp:1587752000),
               Geo(lat:40.76,lon:-73.99,timestamp:1587762000),
               Geo(lat:40.77,lon:-74.00,timestamp:1587770000)]
do {
    //encode: struct to json
    let jsonData = try JSONEncoder().encode(geoList)
    let jsonString = String(data: jsonData, encoding: .utf8)!
    print(jsonString) // [{"lat":40.75,"lon":-73.98,"timestamp":1587749400},{"lat":40.75,"lon":-73.98,"timestamp":1587751200}]

    //decode: json to struct
    let decodedGeos = try JSONDecoder().decode([Geo].self, from: jsonData)
    print(decodedGeos) //[__lldb_expr_166.Geo(lat: 40.75, lon: -73.98, timestamp: 1587749400), __lldb_expr_166.Geo(lat: 40.75, lon: -73.98, timestamp: 1587751200)]
    
    //decode json string to struct
    let JSON = """
    [{  "lat":40.75,
        "lon":-73.98,
        "timestamp":1587749400
    },
    {
        "lat":40.75,
        "lon":-73.98,
        "timestamp":1587751200
    }]
    """
    //input type 2 example
    let test:[Geo] = try! JSONDecoder().decode([Geo].self, from: JSON.data(using: .utf8)!)
    print(test[0].timestamp)
} catch { print(error) }


//---------------------------------------------------------------------------------
// Step 1: convert JSON to geoList input, then use the method - batchReserseGeocodeLocation:
//---------------------------------------------------------------------------------
func batchReserseGeocodeLocation(geoList:[Geo], completionHandler:@escaping([AddressTS]) -> ()){ //Please specify your type as contract to use
// Fire an asynchronous callback when all your requests finish in synchronous.
let asyncGroup = DispatchGroup()
    var placeList: [AddressTS] = [AddressTS](repeating: AddressTS(address:"",timestamp:0), count: geoList.count)  //List of AddressTS
for (index, geo) in geoList.enumerated()
{       asyncGroup.enter()
        //Reverse Geocoding With Clgeocoder
        let gecoder = CLGeocoder.init()
        gecoder.reverseGeocodeLocation(CLLocation.init(latitude:geo.lat,longitude: geo.lon)) { (addresses, error) in
                if error == nil{
                    if let address = addresses{
                        //Async: Here you can get all the info by combining that you can make address!
                        print("Address \(index) : \(address)")
                        //async - availability first
                        //placeList.append(AddressTS(address: address[0].compactAddress!, timestamp: geo.timestamp))
                        //async - sequential reserved - fixed size
                        placeList[index] = AddressTS(address: address[0].compactAddress!, timestamp: geo.timestamp)
                        //TODO: connect with frontend UI.
                        //drawMap(lat:lat,lon:lon,address:address[0])
                        asyncGroup.leave()
                    }
                }
            }
        }
        asyncGroup.notify(queue: .main){
            print("Finished the loop - find \(geoList.count) addresses")
            // action complete
            completionHandler(placeList)
        }
}

// UTC time converter
func UTC_Converter(unixtime1:Double, unixtime2:Double, timezone:String?=nil) -> String{
    // Localization
    var localTimeZoneAbbreviation: String { return TimeZone.current.abbreviation() ?? "" } // "UTC-4"
    let date1 = Date(timeIntervalSince1970: unixtime1)
    let date2 = Date(timeIntervalSince1970: unixtime2)
    let dateFormatter = DateFormatter()
    dateFormatter.timeZone = TimeZone(abbreviation: localTimeZoneAbbreviation) //Set timezone that you want: i.e. New York is "UTC-4"
    // Overwrite
    if (timezone != nil) {
        dateFormatter.timeZone = TimeZone(abbreviation: timezone ?? "")
    }
    dateFormatter.locale = NSLocale.current
    dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss" //Specify your format that you want
    let strDate1 = dateFormatter.string(from: date1)
    let strDate2 = dateFormatter.string(from: date2)
    return (strDate1 + " ~ " + strDate2)
}

//---------------------------------------------------------------------------------
// Step2: aggregate address result - from timestamp to period
//---------------------------------------------------------------------------------
func aggregateAddressList(addressTSList:[AddressTS], completionHandler:@escaping([AddressPeriod]) -> ()){
    var AddressPeriodList: [AddressPeriod] = []  //List of AddressPeriod
    var start: Double = 0 // UTC start
    var end: Double = 0 // UTC end
    var address = "" // address pointer
    for (index, address_ts) in addressTSList.enumerated(){
        if index == 0 { // first one
            start = address_ts.timestamp
            end = address_ts.timestamp
            address = address_ts.address
        }
        else if address_ts.address != address {
            //append - dynamic size
            //logic: same location + 10min
            if start == end {
                AddressPeriodList.append(AddressPeriod(address:address,period: UTC_Converter(unixtime1:start,unixtime2:(start+600))))
            } else {
                AddressPeriodList.append(AddressPeriod(address:address,period: UTC_Converter(unixtime1:start,unixtime2:end)))
            }
            //update
            start = address_ts.timestamp
            end = address_ts.timestamp
            address = address_ts.address
            if index == (addressTSList.count-1){ // last one - unique, add extra
                //logic: same location + 10min
                AddressPeriodList.append(AddressPeriod(address:address_ts.address, period: UTC_Converter(unixtime1:start,unixtime2:(start+600))))
            }
        } else {//move on
            end = address_ts.timestamp
            if index == (addressTSList.count-1){ // last one - same, add extra
                //logic: same location + 10min
                if start == end {
                    AddressPeriodList.append(AddressPeriod(address:address, period: UTC_Converter(unixtime1:start,unixtime2:(start+600))))
                } else {
                    AddressPeriodList.append(AddressPeriod(address:address, period: UTC_Converter(unixtime1:start,unixtime2:end)))
                }
            }
        }
    }
    completionHandler(AddressPeriodList)
}


//---------------------------------------------------------------------------------
//Test - Type 1 input
//---------------------------------------------------------------------------------
batchReserseGeocodeLocation(geoList: geoList, completionHandler: { addressTSList in
    sleep(1)
    do{
        try print("-------------------\nAddressTSList: \((String(data: JSONEncoder().encode(addressTSList), encoding: .utf8)!))")
    }catch{ print(error) }
    aggregateAddressList(addressTSList:addressTSList, completionHandler: { addressPeriodList in
        sleep(1)
        do{
            try print("-------------------\nFinal AddressPeriodList: \((String(data: JSONEncoder().encode(addressPeriodList), encoding: .utf8)!))")
        }catch{ print(error) }
    })
})