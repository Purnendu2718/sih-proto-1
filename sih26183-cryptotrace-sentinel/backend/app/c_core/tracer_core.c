#include "tracer_core.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

static int find_node_idx(Graph* g, const char* address) {
    if (!g || !address) return -1;
    for (int i = 0; i < g->node_count; i++) {
        if (strncmp(g->nodes[i].address, address, MAX_ADDR_LEN) == 0) {
            return i;
        }
    }
    return -1;
}

Graph* create_graph(int max_nodes, int max_edges) {
    Graph* g = (Graph*)malloc(sizeof(Graph));
    if (!g) return NULL;

    g->node_capacity = (max_nodes > 16) ? max_nodes : 16;
    g->node_count = 0;
    g->nodes = (GraphNode*)calloc(g->node_capacity, sizeof(GraphNode));

    g->edge_capacity = (max_edges > 32) ? max_edges : 32;
    g->edge_count = 0;
    g->edges = (GraphEdge*)calloc(g->edge_capacity, sizeof(GraphEdge));

    return g;
}

void free_graph(Graph* g) {
    if (!g) return;
    if (g->nodes) free(g->nodes);
    if (g->edges) free(g->edges);
    free(g);
}

int add_node(Graph* g, const char* address, int is_exchange) {
    if (!g || !address) return -1;

    int idx = find_node_idx(g, address);
    if (idx >= 0) {
        if (is_exchange) g->nodes[idx].is_exchange = 1;
        return idx;
    }

    if (g->node_count >= g->node_capacity) {
        int new_cap = g->node_capacity * 2;
        GraphNode* new_nodes = (GraphNode*)realloc(g->nodes, new_cap * sizeof(GraphNode));
        if (!new_nodes) return -1;
        g->nodes = new_nodes;
        g->node_capacity = new_cap;
    }

    int new_idx = g->node_count++;
    memset(&g->nodes[new_idx], 0, sizeof(GraphNode));
    strncpy(g->nodes[new_idx].address, address, MAX_ADDR_LEN - 1);
    g->nodes[new_idx].is_exchange = is_exchange;
    g->nodes[new_idx].parent_node_idx = -1;
    g->nodes[new_idx].parent_edge_idx = -1;

    return new_idx;
}

void add_edge(Graph* g, const char* from, const char* to, double amount, long long timestamp, const char* tx_hash, int chain_id) {
    if (!g || !from || !to) return;

    int from_idx = add_node(g, from, 0);
    int to_idx = add_node(g, to, 0);

    if (g->edge_count >= g->edge_capacity) {
        int new_cap = g->edge_capacity * 2;
        GraphEdge* new_edges = (GraphEdge*)realloc(g->edges, new_cap * sizeof(GraphEdge));
        if (!new_edges) return;
        g->edges = new_edges;
        g->edge_capacity = new_cap;
    }

    int edge_idx = g->edge_count++;
    g->edges[edge_idx].from_node_idx = from_idx;
    g->edges[edge_idx].to_node_idx = to_idx;
    g->edges[edge_idx].amount = amount;
    g->edges[edge_idx].timestamp = timestamp;
    g->edges[edge_idx].chain_id = chain_id;
    if (tx_hash) {
        strncpy(g->edges[edge_idx].tx_hash, tx_hash, MAX_TX_LEN - 1);
    } else {
        g->edges[edge_idx].tx_hash[0] = '\0';
    }
}

PathResult find_shortest_vasp_path(Graph* g, const char* start_addr, int max_hops) {
    PathResult res;
    memset(&res, 0, sizeof(PathResult));

    if (!g || !start_addr || g->node_count == 0) return res;

    int start_idx = find_node_idx(g, start_addr);
    if (start_idx < 0) return res;

    // Reset node states
    for (int i = 0; i < g->node_count; i++) {
        g->nodes[i].is_visited = 0;
        g->nodes[i].depth = 0;
        g->nodes[i].parent_node_idx = -1;
        g->nodes[i].parent_edge_idx = -1;
    }

    // Queue allocation for bounded BFS
    int* queue = (int*)malloc(g->node_count * sizeof(int));
    if (!queue) return res;

    int head = 0;
    int tail = 0;

    g->nodes[start_idx].is_visited = 1;
    g->nodes[start_idx].depth = 0;
    queue[tail++] = start_idx;

    int target_idx = -1;

    while (head < tail) {
        int curr_idx = queue[head++];
        int curr_depth = g->nodes[curr_idx].depth;

        // Check if current node is an exchange
        if (curr_idx != start_idx && g->nodes[curr_idx].is_exchange) {
            target_idx = curr_idx;
            break;
        }

        if (curr_depth >= max_hops) continue;

        // Scan outgoing edges
        for (int e = 0; e < g->edge_count; e++) {
            if (g->edges[e].from_node_idx == curr_idx) {
                int next_node = g->edges[e].to_node_idx;
                if (!g->nodes[next_node].is_visited) {
                    g->nodes[next_node].is_visited = 1;
                    g->nodes[next_node].depth = curr_depth + 1;
                    g->nodes[next_node].parent_node_idx = curr_idx;
                    g->nodes[next_node].parent_edge_idx = e;
                    queue[tail++] = next_node;

                    // Immediate early exit if exchange reached
                    if (g->nodes[next_node].is_exchange) {
                        target_idx = next_node;
                        break;
                    }
                }
            }
        }
        if (target_idx >= 0) break;
    }

    free(queue);

    if (target_idx >= 0) {
        res.reached_exchange = 1;

        // Reconstruct path backward
        int path_rev_nodes[MAX_PATH_HOPS];
        int path_rev_edges[MAX_PATH_HOPS];
        int count = 0;

        int curr = target_idx;
        while (curr >= 0 && count < MAX_PATH_HOPS) {
            path_rev_nodes[count] = curr;
            path_rev_edges[count] = g->nodes[curr].parent_edge_idx;
            count++;
            if (curr == start_idx) break;
            curr = g->nodes[curr].parent_node_idx;
        }

        res.hop_count = count - 1;

        // Reverse into forward sequence
        for (int i = 0; i < count; i++) {
            int node_idx = path_rev_nodes[count - 1 - i];
            strncpy(res.path_addresses[i], g->nodes[node_idx].address, MAX_ADDR_LEN - 1);

            if (i > 0) {
                int edge_idx = path_rev_edges[count - 1 - i];
                if (edge_idx >= 0 && edge_idx < g->edge_count) {
                    strncpy(res.path_tx_hashes[i - 1], g->edges[edge_idx].tx_hash, MAX_TX_LEN - 1);
                    if (i == count - 1) {
                        res.terminal_amount = g->edges[edge_idx].amount;
                    }
                }
            }
        }
    }

    return res;
}

int detect_peeling_chain(Graph* g, const char* address) {
    if (!g || !address) return 0;
    int idx = find_node_idx(g, address);
    if (idx < 0) return 0;

    int fan_out = 0;
    double amounts[32];
    double total_out = 0.0;

    for (int e = 0; e < g->edge_count; e++) {
        if (g->edges[e].from_node_idx == idx) {
            if (fan_out < 32) {
                amounts[fan_out] = g->edges[e].amount;
            }
            total_out += g->edges[e].amount;
            fan_out++;
        }
    }

    // Peeling chain heuristic: exactly 2 outputs where 1 output constitutes >= 80%
    if (fan_out == 2 && total_out > 0.0) {
        double max_amt = (amounts[0] > amounts[1]) ? amounts[0] : amounts[1];
        if ((max_amt / total_out) >= 0.80) {
            return 1;
        }
    }

    return 0;
}
