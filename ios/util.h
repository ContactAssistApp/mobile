#ifndef __UTIL_H__
#define __UTIL_H__

#include <cstdint>

namespace td {
  int64_t round_down_timestamp(int64_t timestamp, int64_t resolution);
  int64_t get_timestamp(void);
}

#endif
