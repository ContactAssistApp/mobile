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
  int64_t _stepSize, _window, _timestamp;
  bool _crypto;
  Id _currentId;

  int64_t get_rounded_timestamp();

public:
  //initialWindow only matters if there's no existing seed data.
  explicit SeedStore(const std::string &storageLocation, int64_t step_size, int64_t initialWindow, bool useCrypto);

  Id getCurrentId();

  void changeWindow(int64_t newWindow);
  Seed getSeedAndRotate();
  Seed unsafeGetSeedAndNotRotate();
  void makeSeedCurrent();
};

}

#endif
