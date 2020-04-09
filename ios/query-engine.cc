#include <stdio.h>
#include <sys/time.h>

#include <CommonCrypto/CommonDigest.h>
#include "util.h"
#include "query-engine.h"

#define TEST_CODE

namespace td {



void Seed::stepInPlace(Id &id)
{
    uint8_t buffer[32];
    CC_SHA256_CTX ctx;
    CC_SHA256_Init(&ctx);
    CC_SHA256_Update(&ctx, &data[0], 16);
    CC_SHA256_Final(buffer, &ctx);

    memcpy(&data[0], buffer, 16);
    memcpy(&id.data[0], buffer +  16, 16);
    timestamp += SeedStepInSecs;
}

bool BluetoothMatch::hasMatch(int64_t up_to, const std::vector<Id> &localIds)
{
  std::vector<Id> allIds;
  allIds.reserve(LookBackWindowInSecs / Seed::SeedStepInSecs / 2); //on average, each report is 7days old
  int64_t add_from = up_to - LookBackWindowInSecs;
  Id id;

  for(auto &s : seeds) {
    size_t steps = (size_t)((up_to - s.ts()) / Seed::SeedStepInSecs);
    allIds.reserve(steps);
    while(s.ts() < up_to) {
      s.stepInPlace(id);
      if(s.ts() >= add_from)
        allIds.push_back(id);
    }
  }
  std::sort(allIds.begin(), allIds.end());
  //We should probably record when this happens because it happening is >bad<
  allIds.erase(std::unique(allIds.begin(), allIds.end()), allIds.end());

  auto l1_cur = allIds.cbegin();
  auto l1_end = allIds.cend();
  auto l2_cur = localIds.cbegin();
  auto l2_end = localIds.cend();
  while (l1_cur != l1_end && l2_cur != l2_end) {
    if (*l1_cur < *l2_cur) {
      ++l1_cur;
    } else if(*l2_cur < *l1_cur) {
      ++l2_cur;
    } else {
      return true;
    }
  }

  return false;
}

std::vector<bool> performBleMatching(std::vector<BluetoothMatch> &matches, std::vector<Id> &localIds)
{
    int64_t now = get_timestamp();
    //xxx load ids
    std::sort(localIds.begin(), localIds.end());
    localIds.erase( std::unique( localIds.begin(), localIds.end() ), localIds.end() );

    std::vector<bool> matchResults;
    matchResults.reserve(matches.size());
    for(auto &bm : matches) {
        matchResults.push_back(bm.hasMatch(now, localIds));
    }

    return matchResults;
}

}
