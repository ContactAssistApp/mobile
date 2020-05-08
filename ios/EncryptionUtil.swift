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
    
    static let AES_KEY_TAG = "covidsafe.keys.aesKey"
    static let HMAC_KEY_TAG = "covidsafe.keys.hmacKey"

    @objc
    static func requiresMainQueueSetup() -> Bool {
      return true
    }

    @objc
    func encryptWrapper(_ plainText: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
      do {
        let encryptedText = try encrypt(plainText: plainText);
        resolve(encryptedText);
      } catch {
        reject("InternalStateError", "Encryption error: \(error)", nil);
      }
    }
  
    @objc
    func decryptWrapper(_ encryptedString: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        do {
          let origin = try decrypt(encryptedString: encryptedString)
          resolve(origin)
        } catch {
          reject("InternalStateError", "Decryption error: \(error)", nil);
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
  
    func createKey(tag: String) throws -> Data {
        var newKey = Data(count: EncryptionUtil.KEY_SIZE)
        try EncryptionUtil.randomData(length: EncryptionUtil.KEY_SIZE, for: &newKey)
        try KeyChain.add(tag: tag, data: newKey)
        return newKey
    }
}
