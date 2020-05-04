import Foundation
import CommonCrypto

struct AES {
    private let key: Data
    private let ivSize: Int         = kCCBlockSizeAES128
    private let options: CCOptions  = CCOptions(kCCOptionPKCS7Padding)

    enum Error: Swift.Error {
        case invalidKeySize
        case encryptionFailed
        case decryptionFailed
        case dataToStringFailed
    }
    
    init(key: Data) throws {
        guard key.count == EncryptionUtil.KEY_SIZE else {
          throw Error.invalidKeySize
        }
        self.key = key
    }
}

extension AES {
    func encrypt(_ plainText: String) throws -> Data {
        let dataToEncrypt = Data(plainText.utf8)
        let bufferSize: Int = ivSize + dataToEncrypt.count + kCCBlockSizeAES128 // allow result round up to up the nearest multiple of 16 bytes
        var buffer = Data(count: bufferSize)
        try EncryptionUtil.randomData(length: ivSize, for: &buffer) // generate iv
      
        var numberBytesEncrypted: Int = 0

        do {
            try key.withUnsafeBytes { keyBytes in
                try dataToEncrypt.withUnsafeBytes { dataToEncryptBytes in
                    try buffer.withUnsafeMutableBytes { bufferBytes in

                        guard let keyBaseAddress = keyBytes.baseAddress,
                            let dataToEncryptBaseAddress = dataToEncryptBytes.baseAddress,
                            let bufferBaseAddress = bufferBytes.baseAddress else {
                                throw Error.encryptionFailed
                        }

                        let cryptStatus: CCCryptorStatus = CCCrypt(
                            CCOperation(kCCEncrypt),
                            CCAlgorithm(kCCAlgorithmAES128), // alg: CCAlgorithm
                            options,                         // options: CCOptions
                            keyBaseAddress,                  // private key
                            key.count,                       // size of private key
                            bufferBaseAddress,               // iv: Initialization Vector
                            dataToEncryptBaseAddress,        // dataIn: Data to encrypt bytes
                            dataToEncrypt.count,             // dataInLength: Data to encrypt size
                            bufferBaseAddress + ivSize,      // dataOut: encrypted Data buffer
                            bufferSize,                      // dataOutAvailable: encrypted Data buffer size
                            &numberBytesEncrypted            // dataOutMoved: the number of bytes written
                        )
                    
                        guard cryptStatus == CCCryptorStatus(kCCSuccess) else {
                            throw Error.encryptionFailed
                        }
                    }
                }
            }

        } catch {
            throw Error.encryptionFailed
        }

        let encryptedData: Data = buffer[..<(numberBytesEncrypted + ivSize)]
        return encryptedData
    }

    func decrypt(_ dataToDecrypt: Data) throws -> String {
        let bufferSize: Int = dataToDecrypt.count - ivSize
        var buffer = Data(count: bufferSize)

        var numberBytesDecrypted: Int = 0

        do {
            try key.withUnsafeBytes { keyBytes in
                try dataToDecrypt.withUnsafeBytes { dataToDecryptBytes in
                    try buffer.withUnsafeMutableBytes { bufferBytes in

                        guard let keyBaseAddress = keyBytes.baseAddress,
                            let dataToDecryptBaseAddress = dataToDecryptBytes.baseAddress,
                            let bufferBaseAddress = bufferBytes.baseAddress else {
                                throw Error.encryptionFailed
                        }

                        let cryptStatus: CCCryptorStatus = CCCrypt(
                            CCOperation(kCCDecrypt),           // op: CCOperation
                            CCAlgorithm(kCCAlgorithmAES128),   // alg: CCAlgorithm
                            options,                           // options: CCOptions
                            keyBaseAddress,                    // private key used to encrypt
                            key.count,                         // private key size
                            dataToDecryptBaseAddress,          // iv: Initialization Vector
                            dataToDecryptBaseAddress + ivSize, // dataIn: Data to decrypt bytes
                            bufferSize,                        // dataInLength: Data to decrypt size
                            bufferBaseAddress,                 // dataOut: decrypted Data buffer
                            bufferSize,                        // dataOutAvailable: decrypted Data buffer size
                            &numberBytesDecrypted              // dataOutMoved: the number of bytes written
                        )

                        guard cryptStatus == CCCryptorStatus(kCCSuccess) else {
                            throw Error.decryptionFailed
                        }
                    }
                }
            }
        } catch {
            throw Error.encryptionFailed
        }

        let decryptedData: Data = buffer[..<numberBytesDecrypted]

        guard let decryptedString = String(data: decryptedData, encoding: .utf8) else {
            throw Error.dataToStringFailed
        }

        return decryptedString
    }
}
