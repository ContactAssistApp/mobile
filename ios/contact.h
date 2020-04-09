#ifndef __CONTACT_H__
#define __CONTACT_H__

#include <string>
#include <vector>

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
  static const int ActiveContactDurationInSecs = 60;
  static const int MinRssiForContact = -82;

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
  std::vector<Id> findContactsSince(int64_t initialTime);

};

}
#endif
