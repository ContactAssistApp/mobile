import Foundation
import CommonCrypto

class EncryptionUtil {
    enum Error: Swift.Error {
      case generateRandomFailed
      case getKeyFailed
      case decryptionFailed
    }

    static let KEY_SIZE = kCCKeySizeAES256
    static let HMAC_SIZE = Int(CC_SHA256_DIGEST_LENGTH)
    
    static let AES_KEY_TAG = "covidsafe.keys.aes_key"
    static let HMAC_KEY_TAG = "covidsafe.keys.hmac_key"

    static func encrypt(plainText: String) -> String {
        do {
            let aesKey = try KeyChain.get(tag: AES_KEY_TAG) ?? createKey(tag: AES_KEY_TAG)
            print("AES key: \(aesKey.base64EncodedString())")
      
            let aes = try AES(key: aesKey)
            var encryptedData: Data = try aes.encrypt(plainText)
            print("String encrypted (base64): \(encryptedData.base64EncodedString())")

            let hmacKey = try KeyChain.get(tag: HMAC_KEY_TAG) ?? createKey(tag: HMAC_KEY_TAG)
            print("HMAC key: \(hmacKey.base64EncodedString())")
            let hmac = try HMAC(key: hmacKey)
            let hmacVal: Data = try hmac.getHMAC(encryptedData)
            encryptedData.append(hmacVal)
            print(encryptedData)
            return encryptedData.base64EncodedString()
        } catch {
          print("Error: \(error)")
          return ""
        }
    }

    static func decrypt(encryptedString: String) throws -> String {
        guard let aesKey = KeyChain.get(tag: AES_KEY_TAG) else {
            throw Error.getKeyFailed
        }
        guard let hmacKey = KeyChain.get(tag: HMAC_KEY_TAG) else {
            throw Error.getKeyFailed
        }
        
        let aes = try AES(key: aesKey)
        let hmac = try HMAC(key: hmacKey)
        
        let data = Data(base64Encoded: encryptedString, options: .ignoreUnknownCharacters)!
        
        let encryptedData = data.prefix(upTo: data.count - HMAC_SIZE)
        let hmacVal = data.suffix(from: data.count - HMAC_SIZE)
        
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
  
    static func createKey(tag: String) throws -> Data {
        var newKey = Data(count: KEY_SIZE)
        try randomData(length: KEY_SIZE, for: &newKey)
        try KeyChain.add(tag: tag, data: newKey)
        return newKey
    }
}
