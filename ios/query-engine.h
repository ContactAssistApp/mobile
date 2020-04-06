#ifndef __QUERY_ENGINE_H__
#define __QUERY_ENGINE_H__

#include <vector>
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
};

class Seed
{
  std::array<uint8_t, 16> data;
  int64_t timestamp;

  Seed(int64_t ts): timestamp(ts) {}
public:
  static const int64_t SeedStepInSecs = 15 * 60; //15min

  inline int64_t ts() { return timestamp; }

  Seed(uint8_t *raw_data, int64_t ts): timestamp(ts) {
    memcpy(&data[0], raw_data, 16);
  }

  void stepInPlace(Id &id);
};


class BluetoothMatch
{
  std::vector<Seed> seeds;

public:
  static const int64_t LookBackWindowInSecs = 14 * 24 * 3600; //14 days

  void addSeed(Seed &&s) { seeds.push_back(s); }

  Seed at(int i) { return seeds[i]; }

  bool hasMatch(int64_t up_to, const std::vector<Id> &localIds);
};


std::vector<bool> performBleMatching(std::vector<BluetoothMatch> &matches, std::vector<Id> &localIds);

}
#endif
