#include "contact-model.h"
#include <sstream>


namespace td {
std::string Id::serialize() const {
  std::stringstream ss;
  ss << std::hex;
  for(int i = 0; i < 16; ++i)
      ss << (int)(data[i] & 0xFF);
  return std::string(ss.str());
}

Id Id::randomId()
{
  Id res;
  for(int i = 0; i < 16; ++i)
      res.data[i] = (uint8_t)(rand() & 0xFF);
  return res;
}

Id Id::parse(const std::string &s)
{
  Id res;

  for(int i = 0; i < 16; ++i) {
      char tmp[3] = { s[i * 2], s[i * 2 + 1], 0 };
      res.data[i] = (uint8_t)strtol(tmp, NULL, 16);
  }
  return res;
}

  
}
