import { MonitorOverview } from './features/monitors/overview';
import { useStdout } from 'ink';
import { useTheme } from './theme/context';

export const App = () => {
  const { stdout } = useStdout();
  const theme = useTheme();

  return (
    <>
      <MonitorOverview width={stdout.columns} height={stdout.rows} />
    </>
  );
};
