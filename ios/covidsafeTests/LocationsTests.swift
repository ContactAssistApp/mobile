//
//  LocationsTests.swift
//  covidsafeTests
//
//  Created by Apollo Zhu on 5/2/20.
//  Copyright © 2020 CovidSafe. All rights reserved.
//

import XCTest
@testable import covidsafe

class LocationsTests: XCTestCase {
  func testAggregateAddressListEmpty() {
    XCTAssertEqual([], Locations().aggregateAddressList(addressTSList: []))
  }

  func testAggregateAddressListSingleElement() {
    let now = floor(Date().timeIntervalSince1970 * 1000)
    let tenMinutesInMS: Double = 10 * 60 * 1000
    let loc = Locations()
    XCTAssertEqual(
      [
        ["OwO", "UwU", "\(loc.format(now)) - \(loc.format(now + tenMinutesInMS))"]
      ],
      loc.aggregateAddressList(addressTSList: [
        Locations.AddressTS(name: "OwO", address: "UwU", timestamp: now)
      ])
    )
  }

  func testReverseGeoCode() throws {
    let locations = [
      [
        "latitude": 50.934430,
        "longitude": -102.816690,
        "time": 1587843741483,
      ],
      [
        "latitude": 50.934430,
        "longitude": -102.816690,
        "time": 1587843793871,
      ],
      [
        "latitude": 50.934430,
        "longitude": -102.816690,
        "time": 1587843806886,
      ],
      [
        "latitude": 40.742050,
        "longitude": -73.993851,
        "time": 1587843813376,
      ]
    ]

    let expectation = XCTestExpectation(description: "Reverse GeoCode")
    Locations().reverseGeoCode(locations as [NSDictionary]) { (response) in
      expectation.fulfill()
      XCTAssertEqual(
        [
          [
            [
              "675 Sixth Ave",
              "675 Sixth Ave, New York NY 10010, United States",
              "1587843813376 - 1587844413376"
            ],
            [
              "641 6 Ave W",
              "641 6 Ave W, Melville SK S0A 2P1, Canada",
              "1587843741483 - 1587843806886"
            ]
          ]
        ],
        response as! [[[String]]]
      )
    }
    wait(for: [expectation], timeout: 30 /* seconds */)
  }
}
