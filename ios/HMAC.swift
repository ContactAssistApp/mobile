import Foundation
import CommonCrypto

struct HMAC {
    private let key: Data

    enum Error: Swift.Error {
        case invalidKeySize
        case hmacFailed
    }
    
    init(key: Data) throws {
        guard key.count == EncryptionUtil.KEY_SIZE else {
            throw Error.invalidKeySize
        }
        self.key = key
    }
}

extension HMAC {
    func getHMAC(_ encryptedData: Data) throws -> Data {
        var digest = [UInt8](repeating: 0, count: EncryptionUtil.HMAC_SIZE)
        
        do {
            try key.withUnsafeBytes { keyBytes in
                try encryptedData.withUnsafeBytes { encryptedDataBytes in
                    guard let keyBaseAddress = keyBytes.baseAddress,
                          let encryptedDataBaseAddress = encryptedDataBytes.baseAddress else {
                              throw Error.hmacFailed
                          }
                        
                        
                    CCHmac(
                        CCHmacAlgorithm(kCCHmacAlgSHA256),
                        keyBaseAddress,
                        key.count,
                        encryptedDataBaseAddress,
                        encryptedData.count,
                        &digest
                    )
                }
            }
        } catch {
            throw Error.hmacFailed
        }
        
        return Data(_: digest)
    }
}
