import { Box, Text, useInput, useStdout } from "ink";
import { useMonitors } from "./use-monitors";
import { Arrow, MonitorShort } from "./short";
import { useMemo, useState } from "react";
import { useTheme } from "../../theme/context";
import { MonitorSetup } from "./setup";
import { MirrorMenu } from "./mirror-menu";
import { queryPort, type Monitor } from "../../hyprland";
import { createMonitorConfiguration } from "../../hyprland/utils/monitor";

type MonitorOverviewProps = {
  width: number;
  height: number;
};

export const MonitorOverview = ({ width, height }: MonitorOverviewProps) => {
  const { monitors, defaultMonitorConfiguration } = useMonitors();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMirrorMenu, setShowMirrorMenu] = useState(false);
  const selectedMonitor = monitors[selectedIndex];
  const theme = useTheme();
  const { write } = useStdout();

  const mirrorMonitors = useMemo(
    () => monitors.filter((_, i) => i !== selectedIndex),
    [selectedIndex, monitors],
  );

  const handleMirrorSelect = (monitor: Monitor | null) => {
    if (monitor) {
      setShowMirrorMenu(false);

      if (selectedMonitor) {
        queryPort.applyMonitorConfiguration(
          createMonitorConfiguration(selectedMonitor, {
            mirrorOf: monitor.name,
          }),
        );
      }
    }
  };

  useInput(
    input => {
      if (input === "j") {
        setSelectedIndex(i => Math.min(i + 1, monitors.length - 1));
      }
      if (input === "k") {
        setSelectedIndex(i => Math.max(i - 1, 0));
      }
      if (input === "m" && selectedMonitor) {
        setShowMirrorMenu(true);
      }
      if (input === "r") {
        defaultMonitorConfiguration.forEach(configuration => {
          queryPort.applyMonitorConfiguration(configuration);
        });
      }
    },
    { isActive: !showMirrorMenu },
  );

  const setupWidth = Math.floor((width * 3) / 5);
  const listWidth = Math.floor(width - setupWidth - 1);

  return (
    <Box flexDirection="row" gap={1}>
      {/* Available Monitors */}
      <Box flexDirection="column" width={listWidth}>
        <Text color={theme.primary} bold>
          Available Monitors:
        </Text>
        <Box flexDirection="column" borderStyle="round" paddingX={1}>
          {monitors.map((monitor, index) => (
            <MonitorShort
              key={monitor.id}
              monitor={monitor}
              isSelected={selectedIndex === index}
              prefix={!showMirrorMenu && <Arrow isSelected={selectedIndex === index} />}
              maxNameLength={listWidth - 8}
            />
          ))}
        </Box>
        {!showMirrorMenu && (
          <Text color={theme.muted} italic>
            [j/k] to navigate, [enter] to select, [m] to mirror, [r] to reset
          </Text>
        )}

        {showMirrorMenu && (
          <Box flexDirection="column" paddingTop={1}>
            <MirrorMenu
              monitors={mirrorMonitors}
              selectedMonitor={selectedMonitor!}
              onSelect={handleMirrorSelect}
            />
          </Box>
        )}
      </Box>

      {/* Monitor Setup */}
      <Box flexDirection="column" width={setupWidth}>
        <Text color={theme.primary} bold>
          Monitor Setup:
        </Text>
        <Box flexDirection="column" borderStyle="round" padding={1}>
          <MonitorSetup
            monitors={monitors}
            width={setupWidth - 2}
            height={height}
            selectedMonitorId={selectedMonitor?.id ?? -1}
          />
        </Box>
      </Box>
    </Box>
  );
};
