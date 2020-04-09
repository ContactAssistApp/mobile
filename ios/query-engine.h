#ifndef __QUERY_ENGINE_H__
#define __QUERY_ENGINE_H__

#include <vector>
#include <array>
#include "contact-model.h"

namespace td {



class BluetoothMatch
{
  std::vector<Seed> seeds;
  int64_t _lookBackWindow, _seedStepSize;
public:
//  static const int64_t LookBackWindowInSecs = 14 * 24 * 3600; //14 days
  BluetoothMatch(int64_t lookBackWindow, int64_t seedStepSize): _lookBackWindow(lookBackWindow), _seedStepSize(seedStepSize) {}

  void addSeed(Seed &&s) { seeds.push_back(s); }

  Seed at(int i) { return seeds[i]; }

  bool hasMatch(int64_t up_to, const std::vector<Id> &localIds);
};


std::vector<bool> performBleMatching(std::vector<BluetoothMatch> &matches, std::vector<Id> &localIds);

}
#endif
