import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { useMonitors } from './features/monitors/use-monitors';
import { MonitorShort } from './features/monitors/monitor-short';

export const App = () => {

  const { monitors } = useMonitors();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input) => {
    if (input === 'j') setSelectedIndex(i => Math.min(i + 1, monitors.length - 1));
    if (input === 'k') setSelectedIndex(i => Math.max(i - 1, 0));
  });

  return (
    <Box flexDirection="row">
      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        <Text color="cyan" bold>Monitors:</Text>
        <Box flexDirection="column" paddingTop={1}>
          {monitors.map((monitor, index) => (
            <MonitorShort key={monitor.id} monitor={monitor} isSelected={index === selectedIndex} />
          ))}
        </Box>
      </Box>
      <Box flexDirection="column" flexGrow={1} borderStyle="round" paddingX={1} height={20}>
        <Text color="cyan" bold>Setup:</Text>
        {monitors.map((monitor, index) => (
          <Box
            key={monitor.id}
            width={30}
            height={10}
            borderStyle="round"
            borderColor={index === selectedIndex ? 'cyan' : undefined}
            justifyContent="center"
            alignItems="center"
            position="absolute"
            marginLeft={index * 31}
            marginTop={0}
          >
            <Text>{monitor.name}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
