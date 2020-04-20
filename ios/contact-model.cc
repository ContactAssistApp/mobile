#include <sstream>
#include <unistd.h>
#include <fcntl.h>
#include <CommonCrypto/CommonDigest.h>

#include "contact-model.h"
#include "util.h"


namespace td {

static void write_arr(std::stringstream &ss, const uint8_t *data)
{
  ss << std::hex;
  for(int i = 0; i < 16; ++i) {
    uint32_t v = data[i];
    if(v < 0x10)
      ss << 0;
    ss << v;
  }
}

static void read_arr(const std::string &s, uint8_t *data)
{
  for(int i = 0; i < 16; ++i) {
      char tmp[3] = { s[i * 2], s[i * 2 + 1], 0 };
      data[i] = (uint8_t)strtol(tmp, NULL, 16);
  }
}


std::string Id::serialize() const {
  std::stringstream ss;
  write_arr(ss, &data[0]);
  return std::string(ss.str());
}

Id Id::randomId()
{
  Id res;
  for(int i = 0; i < 16; ++i)
      res.data[i] = (uint8_t)(rand() & 0xFF);
  return res;
}

Id Id::parse(const std::string &s)
{
  Id res;
  read_arr(s, &res.data[0]);
  return res;
}

void Seed::stepInPlace(Id &id, int64_t stepSize)
{
    uint8_t buffer[32];
    CC_SHA256_CTX ctx;
    CC_SHA256_Init(&ctx);
    CC_SHA256_Update(&ctx, &data[0], 16);
    CC_SHA256_Final(buffer, &ctx);

    memcpy(&data[0], buffer, 16);
    memcpy(&id.data[0], buffer +  16, 16);
    timestamp += stepSize;
}

Id Seed::genId() const {
  Id id;
  uint8_t buffer[32];
  CC_SHA256_CTX ctx;
  CC_SHA256_Init(&ctx);
  CC_SHA256_Update(&ctx, &data[0], 16);
  CC_SHA256_Final(buffer, &ctx);

  memcpy(&id.data[0], buffer +  16, 16);
  return id;
}

std::string Seed::serialize() const
{
  std::stringstream ss;

  ss << std::dec << timestamp << ",";
  write_arr(ss, &data[0]);
  return ss.str();
}

Seed Seed::parse(const std::string &line)
{
  auto s = split_str(line, ',');
  Seed res = Seed(std::stoll(s[0]));
  read_arr(s[1], &res.data[0]);

  return res;
}


Seed Seed::unsafeRandomSeed(int64_t timestamp)
{
  Seed res = Seed(timestamp);
  for(int i = 0; i < 16; ++i)
      res.data[i] = (uint8_t)(rand() & 0xFF);
  return res;
}

Seed Seed::safeRandomSeed(int64_t timestamp)
{
  Seed res = Seed(timestamp);

  int dev_rand = open("/dev/random", O_RDONLY);
  if(dev_rand < 0)
      throw new std::runtime_error("Error generating seed: could not open /dev/random");

  if(read(dev_rand, &res.data[0], 16) != 16) {
      close(dev_rand);
      throw new std::runtime_error("Error generating seed: could not read enough random byts");
  }
  close(dev_rand);

  return res;
}

}
