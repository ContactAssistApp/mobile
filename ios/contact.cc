#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>

#include <unordered_map>
#include <memory> 
#include <sstream>
#include <fstream>

#include "contact.h"
#include "util.h"

namespace td
{

std::string ContactLogEntry::serialize() const {
  std::stringstream ss;
  ss << _timestamp << "," << _id.serialize() << "," << _rssi << "," << _kind << "\n";
  return ss.str();
}

ContactLogEntry ContactLogEntry::parse(std::string line)
{
  auto s = split_str(line, ',');
  int64_t ts = std::stoll(s[0]);
  Id id = Id::parse(s[1]);
  int rssi = std::stoi(s[2]);
  ContactKind kind = (ContactKind)std::stoi(s[3]);

  return ContactLogEntry(id, ts, rssi, kind);
}

void ContactStore::log(const ContactLogEntry &c)
{
  int fd = open(_logFileName.c_str(), O_RDWR | O_APPEND | O_CREAT, S_IRUSR | S_IWUSR );
  if(!fd)
    throw new std::runtime_error("Could not append to contact logs");
  std::string str = c.serialize();
  write(fd, str.c_str(), str.size());
  fsync(fd);
  close(fd);
}

struct PerIdContact
{
  int16_t active_contacts, passive_contacts;
  PerIdContact() : active_contacts(0), passive_contacts(0) {}

  bool is_significant()
  {
    return active_contacts + passive_contacts > 2; //simple heusristics for determining whether a given Id could have caused exposure
  }

  int contact_count()
  {
    return active_contacts + passive_contacts;
  }
};

std::unordered_map<Id, int> ContactStore::findContactsSince(int64_t initialTime)
{
  /*Algo is the following, keep a window of time and count the number of entries. We consider a contact if we detect  */
  std::ifstream infile(_logFileName);

  //step one, aggregate logs
  std::unordered_map<Id, std::unique_ptr<PerIdContact> > id_agg;

  std::string line;
  while (std::getline(infile, line))
  {
    ContactLogEntry log = ContactLogEntry::parse(line);

    if(log.ts() < initialTime)
      continue;

    if(log.rssi() < ContactLogEntry::MinRssiForContact || log.rssi() == 0)
      continue;

    auto res = id_agg.find(log.id());
    PerIdContact *ptr;

    if(res == id_agg.end())
      id_agg.emplace(log.id(), ptr = new PerIdContact());
    else
      ptr = res->second.get();

    if(log.is_active())
      ptr->active_contacts++;
    else
      ptr->passive_contacts++;
  }

  std::unordered_map<Id, int> res;
  for(auto &kv : id_agg) {
    if(kv.second->is_significant())
      res.insert({ kv.first, kv.second->contact_count() });
  }
  return res;
}

void ContactStore::purgeOldRecords(int64_t age)
{
    std::string tmp_file = _logFileName + ".tmp";
    std::ifstream infile;
    std::ofstream outfile;
    
    infile.exceptions(std::ifstream::badbit);
    outfile.exceptions(std::ofstream::failbit | std::ofstream::badbit);

    infile.open(_logFileName);
    outfile.open(tmp_file);

    std::string line;
    while (std::getline(infile, line)) {
      ContactLogEntry log = ContactLogEntry::parse(line);
      if(log.ts() >= age) {
        outfile.write(line.c_str(), line.size());
        outfile.put('\n');
        }
    }
    infile.close();
    outfile.flush();
    outfile.close();
    rename(tmp_file.c_str(), _logFileName.c_str());
}
}
