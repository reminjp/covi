import * as carlo from 'carlo';

let stdin = '';
let launched = false;

const launch = async () => {
  if (launched) return;
  launched = true;

  const app = await carlo.launch();
  app.on('exit', () => process.exit());
  app.serveFolder(__dirname);

  await app.exposeFunction('getArgv', () => process.argv);
  await app.exposeFunction('getStdin', () => stdin);

  await app.load('index.html');
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
