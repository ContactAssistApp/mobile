#include "crypto.h"
#include <fstream>
#include <sstream>

#include <Foundation/Foundation.h>
#include <WebKit/WebKit.h>

#import "covidsafe-Swift.h"

NSString* td_encrypt(NSString *str)
{
  @try {
    EncryptionUtil *util  = [EncryptionUtil alloc];
    NSError *err = nil;
    NSString *res = [util encryptWithPlainText:str error:&err];
    if(err != nil)
      throw new std::runtime_error(std::string("Failed to decrypt due to ") + err.description.UTF8String);
    return res;
  } @catch(NSException *exception) {
    throw new std::runtime_error(std::string("Failed to decrypt due to ") + exception.description.UTF8String);
  }
//  NSData *data = [str dataUsingEncoding: NSUTF8StringEncoding];
//  return [data base64EncodedStringWithOptions: 0];
}

NSString* td_decrypt(NSString *str)
{
  @try {
    EncryptionUtil *util  = [EncryptionUtil alloc];
    NSError *err = nil;
    NSString *res = [util decryptWithEncryptedString:str error:&err];
    if(err != nil)
      throw new std::runtime_error(std::string("Failed to decrypt due to ") + err.description.UTF8String);
    return res;
  } @catch(NSException *exception) {
    throw new std::runtime_error(std::string("Failed to decrypt due to ") + exception.description.UTF8String);
  }
//    NSData *data = [[NSData alloc]initWithBase64EncodedString: str options: NSDataBase64DecodingIgnoreUnknownCharacters];
//    NSString *res = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
//    return res;
}

namespace td 
{

ProtectedFile::ProtectedFile(const std::string &base_name, bool use_encryption):
    _fileName(base_name + (use_encryption ? ".enc" : ".txt")),
    _crypto(use_encryption),
    _output(-1)
{
}

ProtectedFile::~ProtectedFile()
{
    if(_output > 0) {
        fsync(_output);
        close(_output);
    }
    if(_input)
        delete _input;
}

void ProtectedFile::openOut(bool append)
{
    int mask = append ? O_APPEND : 0;
    _output = open(_fileName.c_str(), O_WRONLY | O_CREAT | mask, S_IRUSR | S_IWUSR);
    if(_output == -1)
        throw new std::runtime_error("Could not open file " + _fileName);
}

void ProtectedFile::writeString(const std::string &data)
{
    if(!_output)
        throw new std::runtime_error("File not in output mode");
    std::string tmp;
    if(!_crypto)
    {
        tmp = data + "\n";
    } else {
        NSString *str = [NSString stringWithUTF8String: data.c_str()];
        str = td_encrypt(str);
        tmp = std::string(str.UTF8String) + "\n";
    }

    if(write(_output, tmp.c_str(), tmp.size()) != tmp.size())
        throw new std::runtime_error("Error writing to " + _fileName);
}

ProtectedFile::ProtectedFile(const std::string &base_name, bool use_encryption, FileMode mode):
    _fileName(base_name + (use_encryption ? ".enc" : ".txt")),
    _crypto(use_encryption),
    _input(nullptr),
    _output(-1)
{
    if(mode == FileMode::Read) {
        _input = new std::ifstream();
        _input->open(_fileName);
    } else if (mode == FileMode::Append) {
        openOut(true);
    } else {
        throw new std::runtime_error("Invalid file mode");
    }
}

void ProtectedFile::setContent(const std::string &base_name, bool use_encryption, const std::string &data)
{
    std::string tmp_name, final_name;
    {
        ProtectedFile pf(base_name + ".tmp", use_encryption);
        tmp_name = pf._fileName;
        final_name = base_name + (use_encryption ? ".enc" : ".txt");
    
        pf.openOut(false);
        std::istringstream ss(data);
        std::string str;
        while(std::getline(ss, str))
            pf.writeString(str);
    }

    rename(tmp_name.c_str(), final_name.c_str());
}

bool ProtectedFile::getline(std::string &line)
{
    if(_input == nullptr)
        throw new std::runtime_error("File not in input mode");

    if(!std::getline(*_input, line))
        return false;
    
    if(_crypto) {
        NSString *str = [NSString stringWithUTF8String: line.c_str()];
        str = td_decrypt(str);
        line = std::string(str.UTF8String);
    }
    return true;
}

void ProtectedFile::append(const std::string &data)
{
    if(!_output)
        throw new std::runtime_error("File not in input mode");

    writeString(data);
}

}

