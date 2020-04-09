#ifndef __CONTACT_MODEL_H__
#define __CONTACT_MODEL_H__

#include <string>
#include <array>

namespace td {

class Id
{
    std::array<uint8_t, 16> data;
    friend class Seed;
public:
  explicit Id(uint8_t *raw_data)
  {
    memcpy(&data[0], raw_data, 16);
  }
  
  explicit Id() {}

  bool operator<(const Id& other) const {
    return memcmp(&data[0], &other.data[0], 16) < 0;
  }

  bool operator==(const Id& other) const {
    return data == other.data;
  }

  std::size_t get_hash() const {
      return *(size_t*)&data[0];
  }

  std::string serialize() const;
  //crypto unsafe pseudo-random ID useful for testing only
  static Id randomId();
  static Id parse(const std::string &s);
};

enum ContactKind
{
    ActiveContact = 1,
    PassiveContact = 2
};

}

// custom specialization of std::hash can be injected in namespace std
namespace std
{
    template<> struct hash<td::Id>
    {
        std::size_t operator()(td::Id const& id) const noexcept
        {
            return id.get_hash();
        }
    };
}

#endif
