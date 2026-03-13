import { Monitor } from '../../hyprland';
import { Box, Text } from 'ink';
import { useTheme } from '../../theme/context';

export const MonitorShort = ({
  monitor,
  isSelected,
}: {
  monitor: Monitor;
  isSelected: boolean;
}) => {
  const theme = useTheme();
  return (
    <Box flexDirection="row" gap={1}>
      <Text color={isSelected ? theme.primary : theme.secondary}>
        [{isSelected ? '>' : ' '}] {monitor.name}:
      </Text>
      <Text color={isSelected ? theme.primary : undefined}>{monitor.description}</Text>
    </Box>
  );
};
