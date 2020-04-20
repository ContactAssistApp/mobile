#ifndef __CONTACT_MODEL_H__
#define __CONTACT_MODEL_H__

#include <string>
#include <array>

namespace td {

#define PROTO_ID_SIZE 16


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
  inline const uint8_t* bytes() const { return &data[0]; }

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


class Seed
{
  std::array<uint8_t, 16> data;
  int64_t timestamp;

  Seed(int64_t ts): timestamp(ts) {}
public:
  // static const int64_t SeedStepInSecs = 15 * 60; //15min

  inline int64_t ts() { return timestamp; }
  explicit Seed(): timestamp(-1){}
  inline const uint8_t* bytes() const { return &data[0]; }

  bool isValid() { return timestamp > 0; }

  void stepInPlace(Id &id, int64_t stepSize);
  Id genId() const;

  std::string serialize() const;
  //crypto unsafe pseudo-random Seed - useful for testing only
  static Seed unsafeRandomSeed(int64_t timestamp);
  //crypto safe random Seed - bad for testing and slow
  static Seed safeRandomSeed(int64_t timestamp);
  static Seed parse(const std::string &s);

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
