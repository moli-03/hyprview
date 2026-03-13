import { render } from 'ink';
import { App } from './app';
import { loadConfig } from './config/loader';
import { resolveTheme } from './config/resolver';
import { Config } from './config/types';
import { ThemeProvider } from './theme/context';

const args = process.argv.slice(2);
const configIndex = args.indexOf('--config');
const configPath = configIndex !== -1 ? args[configIndex + 1] : undefined;

let config: Config | null = null;
if (configPath) {
  const result = loadConfig(configPath);
  if (result.isErr()) {
    process.stderr.write(`hyprview: ${result.error.message}\n`);
    process.exit(1);
  }
  config = result.value;
}

render(
  <ThemeProvider theme={resolveTheme(config)}>
    <App />
  </ThemeProvider>,
);
