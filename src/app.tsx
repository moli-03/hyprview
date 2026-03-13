import { MonitorOverview } from './features/monitors/overview';
import { useStdout } from 'ink';

export const App = () => {
  const { stdout } = useStdout();

  return <MonitorOverview width={stdout.columns} height={stdout.rows} />;
};
