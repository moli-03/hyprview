import { Box, Text, useInput } from 'ink';
import { Monitor } from '../../hyprland';
import { useTheme } from '../../theme/context';
import { Arrow, MonitorShort } from './short';
import { useState } from 'react';

type MirrorMenuProps = {
  monitors: Monitor[];
  selectedMonitor: Monitor;
  onSelect: (monitor: Monitor | null) => void;
};

export const MirrorMenu = ({ monitors, selectedMonitor, onSelect }: MirrorMenuProps) => {
  const theme = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (input === 'j') {
      setSelectedIndex((i) => Math.min(i + 1, monitors.length - 1));
    }
    if (input === 'k') {
      setSelectedIndex((i) => Math.max(i - 1, 0));
    }
    if (key.escape) {
      onSelect(null);
    }
    if (key.return) {
      onSelect(monitors[selectedIndex]);
    }
  });

  return (
    <Box flexDirection="column">
      <Text color={theme.primary} bold>
        Which screen should {selectedMonitor.name} mirror?
      </Text>
      <Box flexDirection="column" borderStyle="round" paddingX={1}>
        {monitors.map((monitor, index) => (
          <MonitorShort
            key={monitor.id}
            monitor={monitor}
            isSelected={selectedIndex === index}
            prefix={<Arrow isSelected={selectedIndex === index} />}
          />
        ))}
      </Box>
      <Text color={theme.muted} italic>
        [j/k] to navigate, [enter] to select, [esc] to cancel
      </Text>
    </Box>
  );
};
