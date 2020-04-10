#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/time.h>
#include <sys/stat.h>
#include <errno.h>
#include <fstream>
#include <sstream>

#include "proto.h"
#include "util.h"

namespace td {

void SeedStore::writeCurrentSeed()
{
    int fd = open(_fileName.c_str(), O_RDWR | O_APPEND | O_CREAT, S_IRUSR | S_IWUSR );
    if(!fd) 
        throw new std::runtime_error("Could not append to seeds log");
    std::stringstream ss;
    ss << _currentSeed.serialize() << "\n";

    auto str = ss.str();
    write(fd, str.c_str(), str.size());
    fsync(fd);
    close(fd);
}

int64_t SeedStore::get_rounded_timestamp()
{
    return round_down_timestamp(get_timestamp(), _stepSize);
}

SeedStore::SeedStore(const std::string &storageLocation, int64_t step_size): _fileName(storageLocation), _stepSize(step_size)
{
    std::ifstream infile(storageLocation);

    std::string line;
    Seed tmp;
    while (std::getline(infile, line)) {
        tmp = Seed::parse(line);
    }

    if(tmp.isValid())
        _currentSeed = tmp;
    else {
        _currentSeed = Seed::safeRandomSeed(get_rounded_timestamp());
        writeCurrentSeed();
    }

    _currentSeed.stepInPlace(_currentId, _stepSize);
}

Id SeedStore::getCurrentId()
{
    auto now = get_rounded_timestamp();
    while(_currentSeed.ts() < now) {
        _currentSeed.stepInPlace(_currentId, _stepSize);
    }
    return _currentId;
}

void SeedStore::rotateSeed()
{
    _currentSeed = Seed::safeRandomSeed(get_rounded_timestamp());
    writeCurrentSeed();
    _currentSeed.stepInPlace(_currentId, _stepSize);
}

std::vector<Seed> SeedStore::getSeeds(int64_t oldest)
{
    std::vector<Seed> res;
    std::ifstream infile(_fileName);

    std::string line;
    while (std::getline(infile, line)) {
        Seed tmp = Seed::parse(line);
        if(tmp.ts() >= oldest)
            res.push_back(tmp);
    }
    return res;
}

void SeedStore::purgeOldRecords(int64_t age)
{
    std::string tmp_file = _fileName + ".tmp";
    std::ifstream infile;
    std::ofstream outfile;
    
    infile.exceptions(std::ifstream::badbit);
    outfile.exceptions(std::ofstream::failbit | std::ofstream::badbit);

    infile.open(_fileName);
    outfile.open(tmp_file);

    std::string line;
    while (std::getline(infile, line)) {
        Seed tmp = Seed::parse(line);
        if(tmp.ts() >= age) {
            outfile.write(line.c_str(), line.size());
            outfile.put('\n');
        }
    }
    infile.close();
    outfile.flush();
    outfile.close();
    rename(tmp_file.c_str(), _fileName.c_str());
}

}

// int main ()
// {
//     td::SeedStore ss("seeds.txt", 2);
//     // ss.rotateSeed();
//     ss.purgeOldRecords(td::get_timestamp() - 1000);
//     auto res = ss.getSeeds(td::get_timestamp() -  1000);
//     printf("got %ld seeds\n", res.size());
//     for(auto &s : res) {
//         printf(">%s\n", s.serialize().c_str());
//     }
//     printf("here\n");
//     return 0;
// }