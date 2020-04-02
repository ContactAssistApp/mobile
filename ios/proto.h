#ifndef __PROTO_H__
#define __PROTO_H__
#include <stdlib.h>

//constants
#define PROTO_INITIAL_SEED 's'
#define PROTO_STEP_SEED 'r'

//error
#define PROTO_ERROR_TS_OLDER -1
#define PROTO_COULD_NOT_GET_RANDOM_BITS -2
#define PROTO_ERROR_WRITE_FAIL -3
#define PROTO_ERROR_BAD_INDEX -4
#define PROTO_ERROR_CANT_SEEK -5

//File format
//fixed row len file format:
//[0] 's' | 'r' (new seed or record update entry)
//[1] ' '
//[2:34] hex of seed (16 bytes)
//[34] ' '
//[35:51] hex of timestamp (int64, number of seconds since unix epoch)
//[51] ' '
//[52:60] version (int32, version of the seed, starts at one)
//[60] '\n'
//integers are hex encoded, octets are big endians and bytes are little-endian
#define PROTO_ROW_SIZE 61
#define PROTO_ID_SIZE 16

//structs
typedef struct proto_idgen proto_idgen_t;

//return current wall clock, monotonic clock. resolution in seconds
int64_t proto_get_timestamp(void);
//step size in seconds
int proto_idgen_create(const char *file, int64_t step_size, proto_idgen_t **out_res);
//free all stuff
void proto_idgen_destroy(proto_idgen_t *td);
//get the current ID
int proto_idgen_get_current_id(proto_idgen_t *td, uint8_t **res);
//rotate the initial seed
int proto_idgen_new_seed(proto_idgen_t *td);

#endif
