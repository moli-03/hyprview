import { Box, Text, useStdout } from 'ink';
import { useMonitors } from './features/monitors/use-monitors';
import { MonitorShort } from './features/monitors/monitor-short';

export const App = () => {

  const { monitors } = useMonitors();

  return (
    <Box flexDirection="row">
      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        <Text color="cyan" bold>Monitors:</Text>
        <Box flexDirection="column" paddingTop={1}>
          {monitors.map(monitor => (
            <MonitorShort key={monitor.id} monitor={monitor} />
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
