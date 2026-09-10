#ifndef TRACER_CORE_H
#define TRACER_CORE_H

#include <stdint.h>

#define MAX_LABEL_LEN 64
#define MAX_ADDR_LEN 64
#define MAX_PATH_HOPS 8

typedef struct {
    char from_addr[MAX_ADDR_LEN];
    char to_addr[MAX_ADDR_LEN];
    double amount;
    int64_t timestamp_utc;
    char tx_hash[MAX_ADDR_LEN];
    int chain_id; /* 0=TRON, 1=EVM, 2=BTC */
} Edge;

typedef struct {
    Edge* edges;
    int edge_count;
    int edge_capacity;
} Graph;

typedef struct {
    char address[MAX_ADDR_LEN];
    int hop_index;
    double amount_at_hop;
    int64_t timestamp_utc;
    char tx_hash[MAX_ADDR_LEN];
    int is_exchange_hit;
    char exchange_label[MAX_LABEL_LEN];
} PathHop;

typedef struct {
    PathHop hops[MAX_PATH_HOPS];
    int hop_count;
    int reached_exchange;
    double terminal_amount;
    double time_to_trace_ms;
} TraceResult;

typedef struct {
    char cluster_address[MAX_ADDR_LEN];
    int fan_in_count;
    int fan_out_count;
    double fan_out_ratio;
    int is_peeling_chain;
} PeelingSignal;

Graph* graph_create(int initial_capacity);
void graph_add_edge(Graph* g, const char* from_addr, const char* to_addr,
                     double amount, int64_t timestamp_utc, const char* tx_hash, int chain_id);
void graph_free(Graph* g);

TraceResult bounded_bfs_to_exchange(Graph* g, const char* start_addr,
                                     const char** exchange_addrs, int exchange_addr_count,
                                     int max_hops, int64_t max_time_window_seconds,
                                     double min_amount_threshold);

PeelingSignal detect_peeling_chain(Graph* g, const char* candidate_addr, double fan_out_ratio_threshold);

#endif
