import Foundation

class KeyChain {
    enum Error: Swift.Error {
        case saveKeyFailed
    }

    static func add(tag: String, data: Data) throws {
        let query: [String: Any] = [
            String(kSecClass): kSecClassKey,
            String(kSecAttrApplicationTag): tag.data(using: String.Encoding.utf8)!,
            String(kSecValueData): data,
            String(kSecAttrAccessible): kSecAttrAccessibleAfterFirstUnlock
        ]

        SecItemDelete(query as CFDictionary)
        
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw Error.saveKeyFailed
        }
    }

    static func get(tag: String) -> Data? {
        let query: [String: Any] = [
            String(kSecClass): kSecClassKey,
            String(kSecAttrApplicationTag): tag.data(using: .utf8)!,
            String(kSecReturnData): true,
            String(kSecAttrAccessible): kSecAttrAccessibleAfterFirstUnlock
        ]
      
        var data: AnyObject? = nil
        let status = SecItemCopyMatching(query as CFDictionary, &data)

        if status == errSecSuccess {
            return data as! Data?
        } else {
            return nil
        }
    }
}
