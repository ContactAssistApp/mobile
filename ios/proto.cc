#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/time.h>
#include <sys/stat.h>
#include <errno.h>
#include <sstream>

#include "proto.h"
#include "util.h"
#include "crypto.h"

//#define EXTRA_DEBUG
namespace td {

class SeedDiskData {
    Seed _s_star;
    Seed _s_current;
    int64_t _window;
    SeedDiskData() {}
public:
    static SeedDiskData createNew(int64_t now, int64_t stepSize, int64_t window)
    {
        now = round_down_timestamp(now, stepSize);
        SeedDiskData res;
        res._s_star = Seed::safeRandomSeed(now - window);
        res._s_current = res._s_star;
        res._window = window;

        Id tmp;
        while(res._s_current.ts() < now) {
            res._s_current.stepInPlace(tmp, stepSize);
        }
        return res;
    }

    static SeedDiskData loadFrom(const std::string &location, bool useCrypto)
    {
        SeedDiskData res;

        ProtectedFile pf(location, useCrypto, FileMode::Read);

        std::string line;
        if (!pf.getline(line))
            throw new std::runtime_error("Could not read from seed file");
        res._window = std::stoll(line);

        if (!pf.getline(line))
            throw new std::runtime_error("Could not read from seed file");
        res._s_star = Seed::parse(line);

        if (!pf.getline(line))
            throw new std::runtime_error("Could not read from seed file");
        res._s_current = Seed::parse(line);

        return res;
    }

    void saveTo(const std::string &location, bool useCrypto)
    {
        std::ostringstream outfile;

        outfile << _window << std::endl;
        outfile << _s_star.serialize() << std::endl;
        outfile << _s_current.serialize() << std::endl;

        ProtectedFile::setContent(location, useCrypto, outfile.str());
    }

    Id stepTo(int64_t now, int64_t stepSize)
    {
        now = round_down_timestamp(now, stepSize);
        if(_s_current.ts() >= now)
            return _s_current.genId();

        Id id;
        while(_s_current.ts() < now) {
            _s_current.stepInPlace(id, stepSize);
            if((_s_current.ts() - _s_star.ts()) > _window) {
                Id tmp;
                _s_star.stepInPlace(tmp, stepSize);
            }
        }
        return id;
    }

    void changeWindow(int64_t newWindow, int64_t stepSize)
    {
        _window = newWindow;

        //roll s_star forward if the new window is smaller
        Id tmp;
        while((_s_current.ts() - _s_star.ts()) > _window) {
            _s_star.stepInPlace(tmp, stepSize);
        }
    }

    int64_t window() const { return _window; }
    Seed sstar() const {return _s_star; }
};

int64_t SeedStore::get_rounded_timestamp()
{
    return round_down_timestamp(get_timestamp(), _stepSize);
}

SeedStore::SeedStore(const std::string &storageLocation, int64_t step_size, int64_t initialWindow, bool useCrypto): _fileName(storageLocation), _stepSize(step_size), _window(initialWindow), _timestamp(0), _crypto(useCrypto)
{
    try {
        SeedDiskData sdd = SeedDiskData::loadFrom(_fileName, useCrypto);
    } catch(std::exception *e) {
        //TODO report that somehow
        SeedDiskData sdd = SeedDiskData::createNew(get_rounded_timestamp(), _stepSize, _window);
        sdd.saveTo(_fileName, useCrypto);
    }
}

Id SeedStore::getCurrentId()
{
    int64_t now = get_rounded_timestamp();
    if(now == _timestamp)
        return _currentId;

    SeedDiskData sdd = SeedDiskData::loadFrom(_fileName, _crypto);
    _currentId = sdd.stepTo(now, _stepSize);
    _timestamp = now;
    sdd.saveTo(_fileName, _crypto);

#ifdef EXTRA_DEBUG
    //dump all ids we shown, must not do in prod code.
    std::string tmpfile = _fileName + ".ids";
    std::ofstream outfile;
    outfile.open( tmpfile.c_str(), std::ios::out | std::ios::app );
    outfile << now << " " << _currentId.serialize() << std::endl;
    outfile.close();
#endif
    return _currentId;
}

void SeedStore::changeWindow(int64_t newWindow)
{
    if(newWindow == _window)
        return;
    SeedDiskData sdd = SeedDiskData::loadFrom(_fileName, _crypto);

    sdd.changeWindow(newWindow, _stepSize);
    sdd.saveTo(_fileName, _crypto);
}

Seed SeedStore::getSeedAndRotate()
{
    int64_t now = get_rounded_timestamp();
    SeedDiskData sdd = SeedDiskData::loadFrom(_fileName, _crypto);
    sdd.stepTo(now, _stepSize);
    Seed seed = sdd.sstar();

    SeedDiskData newData = SeedDiskData::createNew(now, _stepSize, _window);
    newData.saveTo(_fileName, _crypto);
    _timestamp = 0; //force a refresh

    return seed;
}

Seed SeedStore::unsafeGetSeedAndNotRotate()
{
    int64_t now = get_rounded_timestamp();
    SeedDiskData sdd = SeedDiskData::loadFrom(_fileName, _crypto);
    sdd.stepTo(now, _stepSize);
    return sdd.sstar();
}

void SeedStore::makeSeedCurrent()
{
    getCurrentId();
}

}
