export interface Options {
  type?: 'graph';
  graph?: Graph;
}

export interface Graph {
  nodes: string[];
  edges: [number, number, string][];
  directed: boolean;
}
