#ifndef TRACER_CORE_H
#define TRACER_CORE_H

#ifdef __cplusplus
extern "C" {
#endif

#define MAX_ADDR_LEN 64
#define MAX_TX_LEN 80
#define MAX_PATH_HOPS 16

typedef struct {
    char address[MAX_ADDR_LEN];
    int is_exchange;
    int is_visited;
    int depth;
    int parent_node_idx;
    int parent_edge_idx;
} GraphNode;

typedef struct {
    int from_node_idx;
    int to_node_idx;
    double amount;
    long long timestamp;
    char tx_hash[MAX_TX_LEN];
    int chain_id; // 0=TRON, 1=EVM, 2=BTC
} GraphEdge;

typedef struct {
    GraphNode* nodes;
    int node_count;
    int node_capacity;

    GraphEdge* edges;
    int edge_count;
    int edge_capacity;
} Graph;

typedef struct {
    int reached_exchange;
    int hop_count;
    double terminal_amount;
    char path_addresses[MAX_PATH_HOPS][MAX_ADDR_LEN];
    char path_tx_hashes[MAX_PATH_HOPS][MAX_TX_LEN];
} PathResult;

// Core Memory & Construction API
Graph* create_graph(int max_nodes, int max_edges);
void free_graph(Graph* g);
int add_node(Graph* g, const char* address, int is_exchange);
void add_edge(Graph* g, const char* from, const char* to, double amount, long long timestamp, const char* tx_hash, int chain_id);

// High-Performance Forensic Pathfinding & Pattern Algorithms
PathResult find_shortest_vasp_path(Graph* g, const char* start_addr, int max_hops);
int detect_peeling_chain(Graph* g, const char* address);

#ifdef __cplusplus
}
#endif

#endif // TRACER_CORE_H
