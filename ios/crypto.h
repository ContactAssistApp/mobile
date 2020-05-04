#ifndef __CRYPTO_H__
#define __CRYPTO_H__
#include <string>
#include <fstream>
#include <memory>

namespace td {

enum FileMode { Read, Append };

class ProtectedFile {
    std::string _fileName;
    bool _crypto;
    std::ifstream *_input;
    int _output;

    void openOut(bool append);
    void writeString(const std::string &data);
    ProtectedFile(const std::string &base_name, bool use_encryption);

public:
    // ProtectedFile(const std::string &base_name, bool use_encryption);
    ProtectedFile(const std::string &base_name, bool use_encryption, FileMode mode);
    ~ProtectedFile();

    // static ProtectedFile&& openRead(const std::string &base_name, bool use_encryption);
    // static ProtectedFile&& openAppend(const std::string &base_name, bool use_encryption);
    static void setContent(const std::string &base_name, bool use_encryption, const std::string &data);

    bool getline(std::string &line);
    void append(const std::string &data);

    ProtectedFile() = delete;
    ProtectedFile(const ProtectedFile&) = delete;
    ProtectedFile& operator=(const ProtectedFile& other) = delete;
    ProtectedFile& operator=(ProtectedFile&& other) = delete;
};

}

#endif

