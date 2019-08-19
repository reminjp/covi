import * as fs from 'fs';
import * as carlo from 'carlo';

(async () => {
  const app = await carlo.launch();
  app.on('exit', () => process.exit());
  app.serveFolder(__dirname);

  await app.exposeFunction('getArgv', () => process.argv);
  await app.exposeFunction('getStdin', () => fs.readFileSync('/dev/stdin', 'utf8'));

  await app.load('index.html');
})();
