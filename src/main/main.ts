import * as carlo from 'carlo';
import { Command } from 'commander';
import { Options } from './Options';

const packageJson: { name: string; version: string } = require('../package.json');

let stdin = '';
let isStarted = false;

const start = () => {
  if (isStarted) return;
  isStarted = true;

  const table = stdin
    .trim()
    .split(/[\r\n]+/)
    .map(line => line.split(/\s+/));

  const options: Options = {};

  const program = new Command();
  program.version(packageJson.version);
  program
    .command('graph')
    .option('-d, --directed', 'Make edges directed')
    .action(o => {
      options.type = 'graph';
      options.graph = { nodes: [], edges: [], directed: !!o.directed };

      const header = table[0];
      const body = table.slice(1);
      const nodeCount = Number(header[0]);
      const nodeMap = new Map<string, number>();
      body.forEach(row => {
        const edge: [number, number, string] = [undefined, undefined, undefined];
        for (let j = 0; j < Math.min(2, row.length); j++) {
          if (!nodeMap.has(row[j])) {
            nodeMap.set(row[j], options.graph.nodes.length);
            options.graph.nodes.push(row[j]);
          }
          edge[j] = nodeMap.get(row[j]);
        }
        if (edge[0] !== undefined || edge[1] !== undefined) {
          edge[2] = row[2];
          options.graph.edges.push(edge);
        }
      });
      while (options.graph.nodes.length < nodeCount) {
        options.graph.nodes.push(undefined);
      }
    });
  program.parse(process.argv);

  if (options.type === undefined) {
    program.outputHelp();
    process.exit();
  }

  (async () => {
    const app = await carlo.launch({ width: 512, height: 512, title: packageJson.name });
    app.on('exit', () => process.exit());
    app.serveFolder(__dirname);
    await app.exposeFunction('getOptions', () => options);
    await app.load('index.html');
  })().catch(reason => {
    console.error(reason);
  });
};

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  stdin += chunk;
});
process.stdin.on('end', () => {
  start();
});
// for Windows
process.on('SIGINT', () => {
  start();
});
