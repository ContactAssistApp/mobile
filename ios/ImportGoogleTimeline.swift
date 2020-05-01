//
//  ImportGoogleTimeline.swift
//  covidsafe
//
//  Created by Apollo Zhu on 4/28/20.
//  Copyright © 2020 CovidSafe. All rights reserved.
//

import Foundation
import UIKit
import WebKit

public let LOG_WINDOW = 14

@objc(GoogleTimelineImportViewManager)
class GoogleTimelineImportViewManager: RCTViewManager, WKNavigationDelegate {

  override class func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func view() -> UIView! {
    let webView = GoogleTimelineImportView()
    webView.navigationDelegate = self
    webView.activityIndictor.startAnimating()
    webView.load(URLRequest(url: GoogleTimelineImportViewManager.SIGN_IN_URL))
    return webView
  }

  private static let SIGN_IN_URL: URL = "https://accounts.google.com/signin"
  private static let SIGNED_IN_HOST = "https://myaccount.google.com"

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    process(webView: webView, atURL: webView.url)
  }

  private func process(webView: WKWebView, atURL currentURL: URL?) {
    guard let view = webView as? GoogleTimelineImportView else { return }
    view.activityIndictor.stopAnimating()

    guard let callback = view.onReceivingPlacemarks,
      currentURL?.absoluteString
        .hasPrefix(GoogleTimelineImportViewManager.SIGNED_IN_HOST) == true
      else { return }
    view.activityIndictor.startAnimating()
    
    func handleCookies(_ cookies: [HTTPCookie]) {
      request(urlForPreviousDays(), withCookies: cookies, then: callback)
    }

    if #available(iOS 11.0, *) {
      WKWebsiteDataStore.default().httpCookieStore.getAllCookies(handleCookies)
    } else {
      handleCookies(HTTPCookieStorage.shared.cookies ?? [])
    }
  }

  func request(_ url: URL, withCookies cookies: [HTTPCookie],
               then handle: @escaping RCTDirectEventBlock) {
    var request = URLRequest(url: url)
    request.allHTTPHeaderFields = HTTPCookie.requestHeaderFields(with: cookies)
    let task = URLSession.shared.dataTask(with: request) { (dat, res, err) in
      if let data = dat {
        handle([
          "data": String(data: data, encoding: .utf8) ?? "",
          "response": res?.description ?? ""
        ])
      } else {
        handle([
          "error": err?.localizedDescription ?? "",
          "response": res?.description ?? ""
        ])
      }
    }
    task.resume()
  }

  // MARK: - Date Helpers

  func urlForPreviousDays(_ logWindow: Int = LOG_WINDOW) -> URL {
    let now = Date()
    let earlier = Calendar.gregorian.date(byAdding: .day, value: -logWindow, to: now)!
    let componentsNow = Calendar.gregorian.dateComponents([.year, .month, .day], from: now)
    let componentsEarlier = Calendar.gregorian.dateComponents([.year, .month, .day], from: earlier)
    return url(fromYear: componentsEarlier.year!, month: componentsEarlier.month!, day: componentsEarlier.day!,
               toYear: componentsNow.year!, month: componentsNow.month!, day: componentsNow.day!)
  }

  func url(fromYear: Int, month fromMonth: Int, day fromDay: Int,
           toYear: Int, month toMonth: Int, day toDay: Int) -> URL {
    return URL(string: "https://www.google.com/maps/timeline/kml?authuser=0&pb=!1m8"
      + "!1m3!1i\(fromYear)!2i\(fromMonth - 1)!3i\(fromDay)"
      + "!2m3!1i\(toYear)!2i\(toMonth - 1)!3i\(toDay)")!
  }
}

extension Calendar {
  static let gregorian = Calendar(identifier: .gregorian)
}

// MARK: - React Native Component

@objc
private class GoogleTimelineImportView: WKWebView {
  @objc
  var onReceivingPlacemarks: RCTBubblingEventBlock?

  fileprivate private(set) lazy var activityIndictor: UIActivityIndicatorView = {
    let indicator: UIActivityIndicatorView
    if #available(iOS 13.0, *) {
      indicator = .init(style: .large)
    } else {
      indicator = .init(style: .whiteLarge)
    }
    indicator.color = #colorLiteral(red: 0.5529411765, green: 0.3333333333, blue: 0.9137254902, alpha: 1)
    indicator.backgroundColor = UIColor.white.withAlphaComponent(0.75)
    indicator.hidesWhenStopped = true
    addSubview(indicator)
    indicator.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      indicator.centerXAnchor.constraint(equalTo: centerXAnchor),
      indicator.centerYAnchor.constraint(equalTo: centerYAnchor),
      indicator.widthAnchor.constraint(equalTo: widthAnchor),
      indicator.heightAnchor.constraint(equalTo: heightAnchor),
    ])
    return indicator
  }()
}

// MARK: - Helper

extension URL: ExpressibleByStringLiteral {
  public init(stringLiteral value: StringLiteralType) {
    self.init(string: value)!
  }
}
