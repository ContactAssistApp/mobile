#include <stdio.h>
#include <sys/time.h>
#include "util.h"
#include "query-engine.h"
#include "contact.h"

namespace td {

bool BluetoothMatch::hasMatch(int64_t up_to, const std::unordered_map<Id, int> &localIds) const
{
  int64_t add_from = up_to - _lookBackWindow;

  for(auto seed: seeds) { //we make a copy cuz we mutate it in place
    Id id;
    int positive = 0;
    while(seed.ts() < up_to) {
      seed.stepInPlace(id, _seedStepSize);
      if(seed.ts() >= add_from) {
        const auto &contact = localIds.find(id);
        if(contact == localIds.end()) {
          positive = 0;
        } else {
          positive += contact->second;
          if(positive > ContactLogEntry::MinContactsForPositiveSeed) {
            //found a positive contact!
            return true;
          }
        }
      }
    }
  }

  return false;
}

std::vector<Id> BluetoothMatch::expand_seeds(int64_t up_to) const
{
  std::vector<Id> allIds;
  int64_t add_from = up_to - _lookBackWindow;
  Id id;
  for(auto s : seeds) {
    while(s.ts() < up_to) {
      s.stepInPlace(id, _seedStepSize);
      if(s.ts() >= add_from)
        allIds.push_back(id);
      if(allIds.size() > 100000) //hard limit of 100k ids per BTM
        throw new std::runtime_error("too many Ids ");
    }
  }

  if(allIds.size() >= 0)
  {
    std::sort(allIds.begin(), allIds.end());
    //We should probably record when this happens because it happening is >bad<
    allIds.erase(std::unique(allIds.begin(), allIds.end()), allIds.end());
  }

  return allIds;
}

std::vector<bool> performBleMatching(std::vector<BluetoothMatch> &matches, std::unordered_map<Id, int> &localIds)
{
    int64_t now = get_timestamp();

    std::vector<bool> matchResults;
    matchResults.reserve(matches.size());
    for(auto &bm : matches) {
        matchResults.push_back(bm.hasMatch(now, localIds));
    }

    return matchResults;
}

}
