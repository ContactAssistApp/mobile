#ifndef __CONTACT_H__
#define __CONTACT_H__

#include <string>
#include <vector>
#include <unordered_map>

#include "contact-model.h"

namespace td
{

//14 days
#define CONTACT_QUERY_LOOKBACK_PERIOD_IN_SECS (14 * 24 * 3600)

class ContactLogEntry
{
  int64_t _timestamp;
  Id _id;
  int _rssi;
  ContactKind _kind;
public:
  //how long to keep sensing an active contact before flushing a record
  static const int MinRssiForContact = -82;
  //how many entries to see to consider an ID as possibly positive
  static const int MinEntriesForPositiveID = 1; //with current params, this is 3 samples over 15 minutes
  //how many successive possibly positive IDs to see to consider a seed as positive
  static const int MinContactsForPositiveSeed = 1;

  ContactLogEntry(const Id &id, int64_t ts, int rssi, ContactKind k): _id(id), _timestamp(ts), _rssi(rssi), _kind(k) {}

  const Id& id() const { return _id; }
  int64_t ts() const { return _timestamp; }
  int rssi() const { return _rssi; }
  ContactKind kind() const { return _kind; }
  bool is_active() const { return _kind == ActiveContact; }

  std::string serialize() const;

  static ContactLogEntry parse(std::string line);
};

class ContactStore
{
  std::string _logFileName;
public:
  explicit ContactStore(std::string logFileName): _logFileName(logFileName) { }
  void log(const ContactLogEntry &c);
  std::unordered_map<Id, int> findContactsSince(int64_t initialTime);
  void purgeOldRecords(int64_t age);
};

}
#endif
