from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import defaultdict

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Edge(BaseModel):
    id: str
    source: str
    target: str

class Node(BaseModel):
    id: str
    # Add other node properties as needed

class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

def has_cycle(graph: Dict[str, List[str]], node: str, visited: set, rec_stack: set) -> bool:
    """
    Helper function to detect cycles in a directed graph using DFS.
    Returns True if a cycle is found, False otherwise.
    """
    visited.add(node)
    rec_stack.add(node)

    for neighbor in graph.get(node, []):
        if neighbor not in visited:
            if has_cycle(graph, neighbor, visited, rec_stack):
                return True
        elif neighbor in rec_stack:
            return True

    rec_stack.remove(node)
    return False

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph is a Directed Acyclic Graph (DAG).
    Returns True if the graph is a DAG, False otherwise.
    """
    # Create adjacency list representation of the graph
    graph = defaultdict(list)
    for edge in edges:
        graph[edge.source].append(edge.target)

    # Initialize sets for cycle detection
    visited = set()
    rec_stack = set()

    # Check for cycles starting from each node
    for node in nodes:
        if node.id not in visited:
            if has_cycle(graph, node.id, visited, rec_stack):
                return False

    return True

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post("/pipelines/parse", response_model=PipelineResponse)
async def parse_pipeline(request: PipelineRequest):
    try:
        # Calculate number of nodes and edges
        num_nodes = len(request.nodes)
        num_edges = len(request.edges)

        # Check if the graph is a DAG
        is_dag_result = is_dag(request.nodes, request.edges)

        return PipelineResponse(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag_result
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
