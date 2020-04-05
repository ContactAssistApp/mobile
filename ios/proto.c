#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/time.h>
#include <sys/stat.h>
#include <errno.h>
#include "proto.h"

#import <CommonCrypto/CommonDigest.h>


struct proto_row {
    uint8_t seed[16];
    int64_t timestamp;
    int32_t version;
    char mode;
};
typedef struct proto_row proto_row_t;

struct proto_idgen {
    proto_row_t row;
    uint8_t id[16];
    int64_t step_size;
    int storage_fd;
};

static int64_t round_down_timestamp(int64_t timestamp, int64_t resolution)
{
    return (timestamp / resolution) * resolution;
}

static void to_hex(const void *src, int len, char *dest)
{
    const uint8_t *_src = src;
    for(int i = 0; i < len; ++i) {
        sprintf(&dest[i * 2], "%02x", _src[i] & 0xFF);
    }
    dest[len * 2] = 0;
}

static void from_hex(const char*src, int len, void *dest)
{
    uint8_t *_dest = dest;
    char tmp[3] = {0};
    for(int i = 0; i < len; ++i)
    {
        tmp[0] = src[i * 2];
        tmp[1] = src[i * 2 + 1];
        _dest[i] = strtol(tmp, NULL, 16);
    }
}


void serialize_row(char *dest, proto_row_t *row)
{
    dest[0] = row->mode;
    dest[1] = ' ';
    to_hex(row->seed, 16, &dest[2]);
    dest[34] = ' ';
    to_hex((char*)&row->timestamp, 8, &dest[35]);
    dest[51] = ' ';
    to_hex((char*)&row->version, 4, &dest[52]);
    dest[60] = '\n';
}

static void parse_row(proto_row_t *dest, char *data)
{
    dest->mode = data[0];
    from_hex(&data[2], 16, dest->seed);
    from_hex(&data[35], 8, &dest->timestamp);
    from_hex(&data[52], 8, &dest->version);
}

int64_t proto_get_timestamp(void)
{
  struct timeval tv = {0};
  if(gettimeofday(&tv, NULL)) {
      return -1; //fails if tv is invalid
  }
  return (int64_t)tv.tv_sec;
}

static int write_row(proto_idgen_t *td, proto_row_t *row)
{
    char buff[PROTO_ROW_SIZE];
    serialize_row(buff, row);
    if(write(td->storage_fd, buff, PROTO_ROW_SIZE) < 0)
        return errno;
    if(fsync(td->storage_fd))
        return errno;
    return 0;
}

static int read_row(proto_idgen_t *td, proto_row_t *row)
{
    char buff[PROTO_ROW_SIZE];

    ssize_t r = read(td->storage_fd, buff, PROTO_ROW_SIZE);
    if(r == 0) //eof
        return 0;
    if(r != PROTO_ROW_SIZE)
        return -errno;

    parse_row(row, buff);
    return 1;
}

static void proto_one_round(proto_idgen_t *td, uint8_t *seed, uint8_t *id)
{
    uint8_t tmp[32];

    CC_SHA256_CTX ctx;
    CC_SHA256_Init(&ctx);
    CC_SHA256_Update(&ctx, seed, 16);
    CC_SHA256_Final(tmp, &ctx);

    memcpy(seed, &tmp[0], 16);
    memcpy(id, &tmp[16], 16);
}

int proto_idgen_new_seed(proto_idgen_t *td)
{
    ++td->row.version;
    td->row.mode = PROTO_INITIAL_SEED;
    td->row.timestamp = round_down_timestamp(proto_get_timestamp(), td->step_size);

    int dev_rand = open("/dev/random", O_RDONLY);
    if(dev_rand < 0)
        return PROTO_COULD_NOT_GET_RANDOM_BITS;

    if(read(dev_rand, td->row.seed, 16) != 16) {
        close(dev_rand);
        return PROTO_COULD_NOT_GET_RANDOM_BITS;
    }
    close(dev_rand);

    if(write_row(td, &td->row))
        return PROTO_ERROR_WRITE_FAIL;

    proto_one_round(td, td->row.seed, td->id);

    return 0;
}

void proto_idgen_destroy(proto_idgen_t *td)
{
    if(!td)
        return;
    if(td->storage_fd)
        close(td->storage_fd);
    free(td);
}


int proto_idgen_create(const char *file, int64_t step_size, proto_idgen_t **out_res)
{
    *out_res = NULL;
    proto_idgen_t *res = calloc(1, sizeof(proto_idgen_t));
    res->step_size = step_size;
    if((res->storage_fd = open(file, O_RDWR | O_APPEND | O_CREAT, S_IRUSR | S_IWUSR )) < 0) {
      free(res);
      return PROTO_ERROR_BAD_INDEX;
    }

    if(lseek(res->storage_fd, 0, SEEK_END) == 0) {
      //new file, generate an initial token record
      int r = proto_idgen_new_seed(res);
      if(r) {
        proto_idgen_destroy(res);
        return r;
      }
    } else {
      //move to last row
      if(lseek(res->storage_fd, -PROTO_ROW_SIZE, SEEK_END) == -1) {
        proto_idgen_destroy(res);
        return PROTO_ERROR_CANT_SEEK;
      }
      if(read_row(res, &res->row) != 1) {
        proto_idgen_destroy(res);
        return PROTO_ERROR_CANT_READ;
      }

      proto_one_round(res, res->row.seed, res->id);
    }
    *out_res = res;
    return 0;
}

static int proto_idgen_advance_to(proto_idgen_t *td, int64_t new_ts)
{
    if(new_ts < td->row.timestamp)
        return PROTO_ERROR_TS_OLDER;

    new_ts = round_down_timestamp(new_ts, td->step_size);
    while(td->row.timestamp < new_ts) {
        int r;
        //change timestamp and mode, version stays the same
        td->row.timestamp += td->step_size;
        td->row.mode = PROTO_STEP_SEED;
        if((r = write_row(td, &td->row)) != 0)
            return r;
        proto_one_round(td, td->row.seed, td->id);        
    }

    return 0;
}

int proto_idgen_get_current_id(proto_idgen_t *td, uint8_t **res)
{
    *res = NULL;
    int r = proto_idgen_advance_to(td, proto_get_timestamp());
    if(!r)
        *res = td->id;
    return r;
}


int proto_idgen_find_seed(proto_idgen_t *td, int64_t timestamp, int64_t *out_timestamp, uint8_t *out_seed)
{
  int r;
  proto_row_t row;

  if(timestamp > td->row.timestamp) {
    if((r = proto_idgen_advance_to(td, timestamp)) != 0)
      return r;
  }
  
  if(lseek(td->storage_fd, 0, SEEK_SET) == -1)
    return PROTO_ERROR_CANT_SEEK;
    
  
  while((r = read_row(td, &row)) == 1) {
    if(row.timestamp + td->step_size < timestamp) //ignore stuff before timestamp
        continue;

    *out_timestamp = row.timestamp;
    memcpy(out_seed, row.seed, 16);
    lseek(td->storage_fd, 0, SEEK_END);
    return 0;
  }
  
  //fail path
  return (r < 0) ? PROTO_ERROR_CANT_READ : PROTO_ERROR_NO_ID_FOUND;
}
