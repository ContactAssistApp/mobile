import Foundation
import CommonCrypto

@objc(EncryptionUtil)
class EncryptionUtil: NSObject {
    enum Error: Swift.Error {
      case generateRandomFailed
      case getKeyFailed
      case decryptionFailed
    }

    static let KEY_SIZE = kCCKeySizeAES256
    static let HMAC_SIZE = Int(CC_SHA256_DIGEST_LENGTH)
    
    static let AES_KEY_TAG = "covidsafe.keys.aes_key"
    static let HMAC_KEY_TAG = "covidsafe.keys.hmac_key"

    @objc
    func encryptWrapper(_ plainText: String, callback: @escaping RCTResponseSenderBlock) {
        let encryptedText = encrypt(plainText: plainText);
        callback([encryptedText])
    }
  
    @objc
    func decryptWrapper(_ encryptedString: String, callback: @escaping RCTResponseSenderBlock) {
        let origin = decrypt(encryptedString: encryptedString)
        callback([origin])
    }
    
    func encrypt(plainText: String) -> String {
        do {
            let aesKey = try KeyChain.get(tag: EncryptionUtil.AES_KEY_TAG) ?? createKey(tag: EncryptionUtil.AES_KEY_TAG)
            let aes = try AES(key: aesKey)
            var encryptedData: Data = try aes.encrypt(plainText)
            
            let hmacKey = try KeyChain.get(tag: EncryptionUtil.HMAC_KEY_TAG) ?? createKey(tag: EncryptionUtil.HMAC_KEY_TAG)
            let hmac = try HMAC(key: hmacKey)
            let hmacVal: Data = try hmac.getHMAC(encryptedData)
            encryptedData.append(hmacVal)
            return encryptedData.base64EncodedString()
        } catch {
            print("Error: \(error)")
            return ""
        }
    }

    @objc
    func decrypt(encryptedString: String) -> String {
        do {
            guard let aesKey = KeyChain.get(tag: EncryptionUtil.AES_KEY_TAG) else {
              throw Error.getKeyFailed
        }
        guard let hmacKey = KeyChain.get(tag: EncryptionUtil.HMAC_KEY_TAG) else {
            throw Error.getKeyFailed
        }
        
        let aes = try AES(key: aesKey)
        let hmac = try HMAC(key: hmacKey)
        
        let data = Data(base64Encoded: encryptedString, options: .ignoreUnknownCharacters)!
        
        let encryptedData = data.prefix(upTo: data.count - EncryptionUtil.HMAC_SIZE)
        let hmacVal = data.suffix(from: data.count - EncryptionUtil.HMAC_SIZE)
        
        let expectedHmacVal = try hmac.getHMAC(encryptedData)
        
        if (hmacVal.elementsEqual(expectedHmacVal)) {
            let decryptedString: String = try aes.decrypt(encryptedData)
            return decryptedString
        } else {
            throw Error.decryptionFailed
        }
      } catch {
        print("Error: \(error)")
        return ""
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
