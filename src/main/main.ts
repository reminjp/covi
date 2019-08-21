import * as carlo from 'carlo';
import { Command } from 'commander';
import { Options } from './Options';

const packageJson: { name: string; version: string } = require('../package.json');

const options: Options = {};

const program = new Command();
program.version(packageJson.version);
program
  .command('graph')
  .option('-d, --directed', 'Make edges directed')
  .action(command => {
    options.type = 'graph';
    options.directed = command.directed ? true : false;
  });
// program.arguments('<type>').action((type: string) => {
//   if (type === 'graph') {
//     options.type = type;
//   }
// });
program.parse(process.argv);

if (options.type === undefined) {
  program.outputHelp();
  process.exit();
}

let stdin = '';
let launched = false;

const launch = () => {
  (async () => {
    if (launched) return;
    launched = true;

    options.data = stdin
      .trim()
      .split(/[\r\n]+/)
      .map(line => line.split(/\s+/));

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
  launch();
});
// for Windows
process.on('SIGINT', () => {
  launch();
});
