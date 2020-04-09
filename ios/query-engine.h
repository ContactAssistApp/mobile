#ifndef __QUERY_ENGINE_H__
#define __QUERY_ENGINE_H__

#include <vector>
#include <array>
#include "contact-model.h"

namespace td {

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
