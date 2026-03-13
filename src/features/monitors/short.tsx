import { Monitor } from '../../hyprland';
import { Box, Text } from 'ink';
import { useTheme } from '../../theme/context';

export const Arrow = ({ isSelected }: { isSelected: boolean }) => {
  const theme = useTheme();
  return <Text color={theme.primary}>{isSelected ? '>' : ' '}</Text>;
};

export const MonitorShort = ({
  monitor,
  isSelected,
  maxNameLength,
  prefix,
  suffix,
}: {
  monitor: Monitor;
  isSelected: boolean;
  maxNameLength?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}) => {
  const theme = useTheme();

  const trimMonitorName = (name: string) => {
    if (!maxNameLength) {
      return name;
    }

    if (name.length <= maxNameLength) {
      return name;
    }

    return name.slice(0, maxNameLength - 3) + '...';
  };

  return (
    <Box flexDirection="row" gap={1}>
      {prefix}
      <Text color={isSelected ? theme.primary : theme.secondary}>
        {trimMonitorName(monitor.name)}
      </Text>
      <Text color={isSelected ? theme.primary : undefined}>{monitor.description}</Text>
      {suffix}
    </Box>
  );
};
