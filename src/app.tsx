import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { useMonitors } from './features/monitors/use-monitors';
import { MonitorShort } from './features/monitors/monitor-short';
import { MonitorSetup } from './features/monitors/monitor-setup';
import { correctRowAspect } from './utils/scaling';
import { useTheme } from './theme/context';

export const App = () => {
  const theme = useTheme();
  const { monitors } = useMonitors();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input) => {
    if (input === 'j') setSelectedIndex(i => Math.min(i + 1, monitors.length - 1));
    if (input === 'k') setSelectedIndex(i => Math.max(i - 1, 0));
  });

  return (
    <Box flexDirection="row">
      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        <Text color={theme.primary} bold>Monitors:</Text>
        <Box flexDirection="column" paddingTop={1}>
          {monitors.map((monitor, index) => (
            <MonitorShort key={monitor.id} monitor={monitor} isSelected={index === selectedIndex} />
          ))}
        </Box>
      </Box>
      <Box flexDirection="column" flexGrow={1} borderStyle="round" paddingX={1} height={20}>
        <Text color={theme.primary} bold>Setup:</Text>
        <MonitorSetup monitors={monitors} width={80} height={correctRowAspect(80 / 16 * 9)} selectedMonitorId={monitors[selectedIndex]?.id ?? -1} />
      </Box>
    </Box>
  )
}
