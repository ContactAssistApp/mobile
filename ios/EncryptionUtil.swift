import Foundation
import CommonCrypto

@objc(EncryptionUtil)
class EncryptionUtil: NSObject {
    enum Error: Swift.Error {
      case generateRandomFailed
      case getKeyFailed
      case decryptionFailed
      case dataDecodeFail
    }

    static let KEY_SIZE = kCCKeySizeAES256
    static let HMAC_SIZE = Int(CC_SHA256_DIGEST_LENGTH)
    
    static let REALM_KEY_TAG = "covidsafe.keys.realmKey"
    static let AES_KEY_TAG = "covidsafe.keys.aesKey"
    static let HMAC_KEY_TAG = "covidsafe.keys.hmacKey"

    @objc
    static func requiresMainQueueSetup() -> Bool {
      return true
    }

    @objc
    func getRealmKey(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
      do {
        let key = try KeyChain.get(tag: EncryptionUtil.REALM_KEY_TAG) ?? createKey(tag: EncryptionUtil.REALM_KEY_TAG, size: EncryptionUtil.KEY_SIZE + EncryptionUtil.KEY_SIZE)
        resolve(key.base64EncodedString());
      } catch {
        reject("InternalStateError", "Get realm key error: \(error)", nil);
      }
    }

    @objc
    func encrypt(plainText: String) throws -> String {
      let aesKey = try KeyChain.get(tag: EncryptionUtil.AES_KEY_TAG) ?? createKey(tag: EncryptionUtil.AES_KEY_TAG)
      let aes = try AES(key: aesKey)
      var encryptedData: Data = try aes.encrypt(plainText)
      
      let hmacKey = try KeyChain.get(tag: EncryptionUtil.HMAC_KEY_TAG) ?? createKey(tag: EncryptionUtil.HMAC_KEY_TAG)
      let hmac = try HMAC(key: hmacKey)
      let hmacVal: Data = try hmac.getHMAC(encryptedData)
      encryptedData.append(hmacVal)
      return encryptedData.base64EncodedString()
    }

    @objc
    func decrypt(encryptedString: String) throws -> String {
      guard let aesKey = KeyChain.get(tag: EncryptionUtil.AES_KEY_TAG) else {
        throw Error.getKeyFailed
      }
      guard let hmacKey = KeyChain.get(tag: EncryptionUtil.HMAC_KEY_TAG) else {
          throw Error.getKeyFailed
      }
      
      let aes = try AES(key: aesKey)
      let hmac = try HMAC(key: hmacKey)
      
      guard let data = Data(base64Encoded: encryptedString, options: .ignoreUnknownCharacters) else {
        throw Error.dataDecodeFail
      }
      
      let encryptedData = data.prefix(upTo: data.count - EncryptionUtil.HMAC_SIZE)
      let hmacVal = data.suffix(from: data.count - EncryptionUtil.HMAC_SIZE)
      
      let expectedHmacVal = try hmac.getHMAC(encryptedData)
      
      if (hmacVal.elementsEqual(expectedHmacVal)) {
          let decryptedString: String = try aes.decrypt(encryptedData)
          return decryptedString
      } else {
          throw Error.decryptionFailed
      }
    }

    static func randomData(length: Int, for data: inout Data) throws {
        try data.withUnsafeMutableBytes { dataBytes in
            guard let dataBaseAddress = dataBytes.baseAddress else {
                throw Error.generateRandomFailed
            }

            let status: Int32 = SecRandomCopyBytes(
                kSecRandomDefault,
                length,
                dataBaseAddress
            )

            guard status == 0 else {
                throw Error.generateRandomFailed
            }
        }
    }
  
    func createKey(tag: String, size: Int = EncryptionUtil.KEY_SIZE) throws -> Data {
        var newKey = Data(count: size)
        try EncryptionUtil.randomData(length: size, for: &newKey)
        try KeyChain.add(tag: tag, data: newKey)
        return newKey
    }
}
