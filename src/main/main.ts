import * as carlo from 'carlo';
import { Command } from 'commander';
import { Options } from './Options';

const packageJson: { name: string; version: string } = require('../package.json');

const options: Options = {};

const program = new Command();
program.version(packageJson.version);
program.arguments('<type>').action(type => {
  options.type = type;
});
program.parse(process.argv);

let stdin = '';
let launched = false;

const launch = () => {
  (async () => {
    if (launched) return;
    launched = true;

    options.tokens = stdin.split(/[\r\n]+/).map(line => line.split(/\s+/).filter(token => token !== ''));

    const app = await carlo.launch({ width: 512, height: 512, title: packageJson.name });
    app.on('exit', () => process.exit());
    app.serveFolder(__dirname);
    await app.exposeFunction('getOption', () => options);
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
