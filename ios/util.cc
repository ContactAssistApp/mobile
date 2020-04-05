#include <sys/time.h>

#include "util.h"

namespace td {

int64_t round_down_timestamp(int64_t timestamp, int64_t resolution)
{
    return (timestamp / resolution) * resolution;
}


int64_t get_timestamp()
{
  struct timeval tv = { 0 };
  if(gettimeofday(&tv, nullptr)) {
      return -1; //fails if tv is invalid
  }
  return (int64_t)tv.tv_sec;
}

}
