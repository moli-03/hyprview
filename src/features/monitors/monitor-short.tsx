import { Monitor } from '../../hyprland';
import { Box, Text } from 'ink';
export const MonitorShort = ({
  monitor,
  isSelected,
}: {
  monitor: Monitor;
  isSelected: boolean;
}) => {
  return (
    <Box flexDirection="row" gap={1}>
      <Text color={isSelected ? 'cyan' : 'green'}>
        [{isSelected ? '>' : ' '}] {monitor.name}:
      </Text>
      <Text color={isSelected ? 'cyan' : undefined}>{monitor.description}</Text>
    </Box>
  );
};
