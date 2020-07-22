import json
import mpu
import numpy
from datetime import datetime
import argparse


def pretty_time_delta(seconds):
    seconds = int(seconds)
    days, seconds = divmod(seconds, 86400)
    hours, seconds = divmod(seconds, 3600)
    minutes, seconds = divmod(seconds, 60)
    if days > 0:
        return '%dd%dh%dm%ds' % (days, hours, minutes, seconds)
    elif hours > 0:
        return '%dh%dm%ds' % (hours, minutes, seconds)
    elif minutes > 0:
        return '%dm%ds' % (minutes, seconds)
    else:
        return '%ds' % (seconds,)

def agg_fun1(data):
    locations = data['locations']
    locs = []
    locs_d = dict()
    for i in range(0, len(locations)):
        l = locations[str(i)]
        locs.append(l)
        if l["address"] not in locs_d:
            locs_d[l["address"]] = []
        locs_d[l["address"]].append((l["latitude"], l["longitude"], l["accuracy"]))

    print(f'found {len(locs_d)} locations')

    aggr_loc = []
    for addr in locs_d:
        if addr == "Unknown":
            continue

        l = locs_d[addr]
        lat = 0
        lon = 0
        acc = 0
        for entry in l:
            lat += entry[0]
            lon += entry[1]
            acc += entry[2]
        
        lat /= len(l)
        lon /= len(l)
        acc /= len(l)

        if acc < 100:
            aggr_loc.append([addr, lat, lon, acc, len(l), True, 1, len(l)])

    for i in range(0, len(aggr_loc)):
        for j in range(i + 1, len(aggr_loc)):
            src = aggr_loc[i]
            dest = aggr_loc[j]
            if src[5] == False or dest[5] == False:
                continue

            cross_addr_dist = mpu.haversine_distance((src[1], src[2]), (dest[1], dest[2])) * 1000
            if cross_addr_dist < ((src[3] + dest[3]) / 2):
                # print(f'clustering {src[0]} and {dest[0]} as they are {cross_addr_dist} apart s0 {src[3]} d0 {dest[3]}')
                if src[4] >= dest[4]:
                    dest[5] = False
                    src[6] += dest[6]
                    src[7] += dest[4]
                else:
                    src[5] = False
                    dest[6] += src[6]
                    dest[7] += src[4]


    for entry in aggr_loc:
        if entry[5]:
            print(entry)


class Location:
    def __init__(self, addr, lat, lon, acc, time):
        self.locs = []
        self.lat = lat
        self.lon = lon
        self.acc = acc
        self.count = 1
        self.startTime = time
        self.endTime = time
        self.locs.append([addr, 1])
    pass

    def append(self, addr, lat, lon, acc, time):
        cross_addr_dist = mpu.haversine_distance((lat, lon), (self.lat / self.count, self.lon / self.count)) * 1000
        acc = (acc + (self.acc / self.count)) / 2
        if cross_addr_dist > acc:
            return False
        self.lat += lat
        self.lon += lon
        self.count += 1
        self.endTime = time
        for addr_count in self.locs:
            if addr_count[0] == addr:
                addr_count[1] += 1
                return True
        self.locs.append([addr, 1])
        return True

    def finish(self):
        # print(self.locs)
        addr = max(self.locs, key=lambda x: x[1])
        self.addr = addr[0]

    def __str__(self):
        self.finish()
        start = datetime.utcfromtimestamp(self.startTime / 1000).strftime('%Y-%m-%d %H:%M')
        end = datetime.utcfromtimestamp(self.endTime / 1000).strftime('%Y-%m-%d %H:%M')
        return f'{self.addr}: addrs:{len(self.locs)} hits:{self.count} from:{start} to:{end}'


def agg_fun2(data):
    locations = data['locations']
    locs = []
    for i in range(0, len(locations)):
        l = locations[str(i)]
        if l['address'] == 'Unknown':
            continue
        if len(locs) == 0 or not locs[len(locs) - 1].append(l["address"], l["latitude"], l["longitude"], l["accuracy"], l["time"]):
            locs.append(Location(l["address"], l["latitude"], l["longitude"], l["accuracy"], l["time"]))

    for l in locs:
        print(l)


def show_locs(data):
    locations = data['locations']
    unique_locs = dict()
    locs = []
    for i in range(0, len(locations)):
        l = locations[str(i)]
        if l['address'] == 'Unknown':
            continue
        addr = l['address']
        time = datetime.utcfromtimestamp(l["time"] / 1000).strftime('%Y-%m-%d %H:%M')
        if not addr in unique_locs:
            unique_locs[addr] = set()
        
        unique_locs[addr].add(time)

    for k in unique_locs:
        print(f'{k} (count:{len(unique_locs[k])}): {unique_locs[k]}')

def show_stats(data):
    locs = []
    for i in range(0, len(data['locations'])):
        locs.append(data['locations'][str(i)])
    print(f'we have {len(locs)} location entries')
    initial_time = locs[0]['time']
    last_time = locs[len(locs) - 1]['time']
    delta_in_secs = (last_time - initial_time) / 1000
    avg_t = delta_in_secs / len(locs)

    print(f'time range: {pretty_time_delta(delta_in_secs)}')
    print(f'avg time per sample: {pretty_time_delta(avg_t)}')

    deltas = [(locs[i]['time'] - locs[i - 1]['time']) / 1000 for i in range(1, len(locs))]
    deltas.sort()
    print(f'Time delta distribution ({len(deltas)} entries)')

    bins = 10
    for i in range(0, bins):
        bin_size = int(len(deltas) / bins)
        i_low = int(i * bin_size)
        i_high = int(i_low + bin_size)
        if i == bins - 1:
            i_high = len(deltas) - 1
        count = i_high - i_low
        low = deltas[i_low]
        high = deltas[i_high]
        avg = sum(deltas[i_low : i_high]) / (i_high - i_low)
        print(f'\tcount:{i_high - i_low} range:{pretty_time_delta(low)} - {pretty_time_delta(high)} avg:{pretty_time_delta(avg)}')


    print('histogram')
    (hist, edge) = numpy.histogram(deltas, bins=10)
    for i in range(0, len(hist)):
        right_b = '[' if i < len(hist) - 1 else ']'
        left = pretty_time_delta(edge[i])
        right = pretty_time_delta(edge[i +  1])
        print(f'\t[{left}, {right}{right_b} : {hist[i]}')

parser = argparse.ArgumentParser()
parser.add_argument('--file', '-f', help='File name to parse (default to dump.json)', type=str)
parser.add_argument('--agg1', '-g1', help='Perform time insensitive aggregation', action='store_true')
parser.add_argument('--agg2', '-g2', help='Perform time sensitive aggregation (default)', action='store_true')
parser.add_argument('--locs', '-l', help='Show raw location log', action='store_true')
parser.add_argument('--stats', '-s', help='Show some basic stats', action='store_true')
args = parser.parse_args()

file_name = args.file or 'dump.json'
file_dump = json.load(open(file_name))

#this is uggly 
if not args.agg1 and not args.agg2 and not args.locs and not args.stats:
    args.agg2 = True

if args.agg1:
    agg_fun1(file_dump)

if args.agg2:
    agg_fun2(file_dump)

if args.locs:
    show_locs(file_dump)

if args.stats:
    show_stats(file_dump)
