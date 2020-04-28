//
//  GoogleSignIn.swift
//  covidsafe
//
//  Created by Apollo Zhu on 4/28/20.
//  Copyright © 2020 CovidSafe. All rights reserved.
//

import Foundation
import UIKit
import WebKit


@objc(GoogleTimelineImportViewManager)
class GoogleTimelineImportViewManager: RCTViewManager, WKNavigationDelegate {

  override class func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func view() -> UIView! {
    return webView
  }

  static let SIGN_IN_URL = URL(string: "https://accounts.google.com/signin")!
  static let SIGNED_IN_HOST = "https://myaccount.google.com"

  private lazy var webView: WKWebView = {
    let webView = GoogleTimelineImportView()
    webView.navigationDelegate = self
    webView.load(URLRequest(url: GoogleTimelineImportViewManager.SIGN_IN_URL))
    return webView
  }()

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    process(webView: webView, atURL: webView.url)
  }

  func process(webView: WKWebView, atURL currentURL: URL?) {
    print("hello")
    if let view = webView as? GoogleTimelineImportView,
      let callback = view.onReceivingPlacemarks,
      currentURL?.absoluteString
        .hasPrefix(GoogleTimelineImportViewManager.SIGNED_IN_HOST) == true {

      func handle(withCookie cookies: [HTTPCookie]) {
        print(cookies)
        request(url(forPreviousDays: view.logWindow), withCookies: cookies, then: callback)
      }

      print("Cookies: ", HTTPCookieStorage.shared.cookies ?? [])
      if #available(iOS 11.0, *) {
        WKWebsiteDataStore.default().httpCookieStore.getAllCookies { (cookies) in
          handle(withCookie: cookies)
        }
      } else {
        handle(withCookie: HTTPCookieStorage.shared.cookies ?? [])
      }
    }
  }

  func url(forPreviousDays logWindow: Int) -> URL {
    let now = Date()
    let earlier = Calendar.gregorian.date(byAdding: .day, value: -logWindow, to: now)!
    let componentsNow = Calendar.gregorian.dateComponents([.year, .month, .day], from: now)
    let componentsEarlier = Calendar.gregorian.dateComponents([.year, .month, .day], from: earlier)
    return url(fromYear: componentsEarlier.year!, month: componentsEarlier.month!, day: componentsEarlier.day!,
               toYear: componentsNow.year!, month: componentsNow.month!, day: componentsNow.day!)
  }

  func url(fromYear: Int, month fromMonth: Int, day fromDay: Int, toYear: Int, month toMonth: Int, day toDay: Int) -> URL {
    return URL(string: "https://www.google.com/maps/timeline/kml?authuser=0&pb=!1m8"
      + "!1m3!1i\(fromYear)!2i\(fromMonth - 1)!3i\(fromDay)"
      + "!2m3!1i\(toYear)!2i\(toMonth - 1)!3i\(toDay)")!
  }

  func request(_ url: URL, withCookies cookies: [HTTPCookie],
               then handle: @escaping RCTBubblingEventBlock) {
    var request = URLRequest(url: url)
    request.allHTTPHeaderFields = HTTPCookie.requestHeaderFields(with: cookies)
    let task = URLSession.shared.dataTask(with: request) { (dat, res, err) in
      if let data = dat {
        handle([
          "data": String(data: data, encoding: .utf8) ?? "no data",
          "response": res?.description ?? "no response"
        ])
      } else {
        handle([
          "error": err?.localizedDescription ?? "Whatever",
          "response": res?.description ?? "no response"
        ])
      }
    }
    task.resume()
  }
}

extension Calendar {
  static let gregorian = Calendar(identifier: .gregorian)
}

@objc
private class GoogleTimelineImportView: WKWebView {
  @objc
  var onReceivingPlacemarks: RCTBubblingEventBlock?
  @objc
  var logWindow: Int = 14
}



