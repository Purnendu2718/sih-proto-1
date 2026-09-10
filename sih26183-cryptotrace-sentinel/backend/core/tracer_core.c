#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "tracer_core.h"

Graph* graph_create(int initial_capacity) {
    Graph* g = (Graph*)malloc(sizeof(Graph));
    g->edges = (Edge*)malloc(sizeof(Edge) * initial_capacity);
    g->edge_count = 0;
    g->edge_capacity = initial_capacity;
    return g;
}

void graph_add_edge(Graph* g, const char* from_addr, const char* to_addr,
                     double amount, int64_t timestamp_utc, const char* tx_hash, int chain_id) {
    if (g->edge_count >= g->edge_capacity) {
        g->edge_capacity *= 2;
        g->edges = (Edge*)realloc(g->edges, sizeof(Edge) * g->edge_capacity);
    }
    Edge* e = &g->edges[g->edge_count];
    strncpy(e->from_addr, from_addr, MAX_ADDR_LEN - 1); e->from_addr[MAX_ADDR_LEN-1] = '\0';
    strncpy(e->to_addr, to_addr, MAX_ADDR_LEN - 1);     e->to_addr[MAX_ADDR_LEN-1] = '\0';
    e->amount = amount;
    e->timestamp_utc = timestamp_utc;
    strncpy(e->tx_hash, tx_hash, MAX_ADDR_LEN - 1);     e->tx_hash[MAX_ADDR_LEN-1] = '\0';
    e->chain_id = chain_id;
    g->edge_count++;
}

void graph_free(Graph* g) {
    if (!g) return;
    free(g->edges);
    free(g);
}

typedef struct QNode {
    char address[MAX_ADDR_LEN];
    int depth;
    double amount;
    int64_t last_ts;
    PathHop path[MAX_PATH_HOPS];
    int path_len;
} QNode;

TraceResult bounded_bfs_to_exchange(Graph* g, const char* start_addr,
                                     const char** exchange_addrs, int exchange_addr_count,
                                     int max_hops, int64_t max_time_window_seconds,
                                     double min_amount_threshold) {
    TraceResult result;
    memset(&result, 0, sizeof(TraceResult));

    int capacity = 256;
    QNode* queue = (QNode*)malloc(sizeof(QNode) * capacity);
    int head = 0, tail = 0;

    strncpy(queue[tail].address, start_addr, MAX_ADDR_LEN - 1);
    queue[tail].address[MAX_ADDR_LEN-1] = '\0';
    queue[tail].depth = 0;
    queue[tail].amount = 0.0;
    queue[tail].last_ts = 0;
    queue[tail].path_len = 0;
    tail++;

    int64_t origin_ts = -1;
    char visited[512][MAX_ADDR_LEN];
    int visited_count = 0;
    strncpy(visited[visited_count++], start_addr, MAX_ADDR_LEN - 1);

    while (head < tail) {
        QNode current = queue[head++];

        for (int i = 0; i < exchange_addr_count; i++) {
            if (strcmp(current.address, exchange_addrs[i]) == 0 && current.path_len > 0) {
                result.hop_count = current.path_len;
                for (int k = 0; k < current.path_len; k++) result.hops[k] = current.path[k];
                result.reached_exchange = 1;
                result.terminal_amount = current.amount;
                free(queue);
                return result;
            }
        }

        if (current.depth >= max_hops) continue;

        for (int e = 0; e < g->edge_count; e++) {
            Edge* edge = &g->edges[e];
            if (strcmp(edge->from_addr, current.address) != 0) continue;
            if (edge->amount < min_amount_threshold) continue;
            if (current.path_len > 0 && edge->timestamp_utc < current.last_ts) continue;
            if (origin_ts < 0) origin_ts = edge->timestamp_utc;
            if (max_time_window_seconds > 0 &&
                (edge->timestamp_utc - origin_ts) > max_time_window_seconds) continue;

            int already_visited = 0;
            for (int v = 0; v < visited_count; v++) {
                if (strcmp(visited[v], edge->to_addr) == 0) { already_visited = 1; break; }
            }
            if (already_visited) continue;

            if (tail >= capacity) {
                capacity *= 2;
                queue = (QNode*)realloc(queue, sizeof(QNode) * capacity);
            }

            QNode next = current;
            strncpy(next.address, edge->to_addr, MAX_ADDR_LEN - 1);
            next.address[MAX_ADDR_LEN-1] = '\0';
            next.depth = current.depth + 1;
            next.amount = edge->amount;
            next.last_ts = edge->timestamp_utc;

            if (next.path_len < MAX_PATH_HOPS) {
                PathHop hop; memset(&hop, 0, sizeof(PathHop));
                strncpy(hop.address, edge->to_addr, MAX_ADDR_LEN - 1);
                hop.hop_index = next.depth;
                hop.amount_at_hop = edge->amount;
                hop.timestamp_utc = edge->timestamp_utc;
                strncpy(hop.tx_hash, edge->tx_hash, MAX_ADDR_LEN - 1);
                hop.is_exchange_hit = 0;
                next.path[next.path_len++] = hop;
            }

            if (visited_count < 512) {
                strncpy(visited[visited_count++], edge->to_addr, MAX_ADDR_LEN - 1);
            }

            queue[tail++] = next;
        }
    }

    free(queue);
    result.reached_exchange = 0;
    return result;
}

PeelingSignal detect_peeling_chain(Graph* g, const char* candidate_addr, double fan_out_ratio_threshold) {
    PeelingSignal signal;
    memset(&signal, 0, sizeof(PeelingSignal));
    strncpy(signal.cluster_address, candidate_addr, MAX_ADDR_LEN - 1);

    int fan_in = 0, fan_out = 0;
    for (int e = 0; e < g->edge_count; e++) {
        if (strcmp(g->edges[e].to_addr, candidate_addr) == 0) fan_in++;
        if (strcmp(g->edges[e].from_addr, candidate_addr) == 0) fan_out++;
    }
    signal.fan_in_count = fan_in;
    signal.fan_out_count = fan_out;
    signal.fan_out_ratio = (fan_in > 0) ? ((double)fan_out / (double)fan_in) : 0.0;
    signal.is_peeling_chain =
        (fan_in <= 1 && fan_out >= 2 && signal.fan_out_ratio >= fan_out_ratio_threshold) ? 1 : 0;
    return signal;
}
