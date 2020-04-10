#ifndef __PROTO_H__
#define __PROTO_H__
#include <stdlib.h>

#include <vector>
#include <string>
#include "contact-model.h"

//structs
namespace td {

class SeedStore {
  std::string _fileName;
  int64_t _stepSize;
  Seed _currentSeed;
  Id _currentId;

  void writeCurrentSeed();
  int64_t get_rounded_timestamp();

public:
  explicit SeedStore(const std::string &storageLocation, int64_t step_size);
  
  void rotateSeed();
  Id getCurrentId();

  std::vector<Seed> getSeeds(int64_t oldest);
  void purgeOldRecords(int64_t age);
};
}

#endif
