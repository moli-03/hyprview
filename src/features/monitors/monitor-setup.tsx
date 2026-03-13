import { Box, Newline, Text } from 'ink';
import { Monitor } from '../../hyprland';
import { correctRowAspect } from '../../utils/scaling';

type MonitorSetupProps = {
  monitors: Monitor[];
  width: number;
  height: number;
  selectedMonitorId: string;
};

export const MonitorSetup = ({ monitors, width, height, selectedMonitorId }: MonitorSetupProps) => {
  const monitorsMinX = Math.min(...monitors.map((monitor) => monitor.x));
  const monitorsMaxX = Math.max(...monitors.map((monitor) => monitor.x + monitor.width));
  const monitorsMinY = Math.min(...monitors.map((monitor) => monitor.y));
  const monitorsMaxY = Math.max(...monitors.map((monitor) => monitor.y + monitor.height));

  const monitorSetupWidth = monitorsMaxX - monitorsMinX;
  const monitorSetupHeight = monitorsMaxY - monitorsMinY;

  const widthRatio = width / monitorSetupWidth;
  const heightRatio = height / monitorSetupHeight;

  const calculateMonitorConstraints = (monitor: Monitor) => {
    return {
      monitor,
      width: monitor.width * widthRatio,
      height: correctRowAspect(monitor.height * heightRatio),
      x: Math.floor((monitor.x - monitorsMinX) * widthRatio - 1), // -1 because by default we have a margin of 1 on the left and right
      y: Math.floor(correctRowAspect((monitor.y - monitorsMinY) * heightRatio) - 1),
    };
  };

  const monitorConstraints = monitors.map(calculateMonitorConstraints);

  const formatRefreshRate = (refreshRate: number) => {
    return refreshRate.toFixed(2);
  };

  return (
    <Box width={width} height={height}>
      {monitorConstraints.map((constraint) => {
        const isSelected = constraint.monitor.id === selectedMonitorId;
        return (
          <Box
            key={constraint.monitor.id}
            width={constraint.width}
            height={constraint.height}
            position="absolute"
            borderStyle="round"
            borderColor={isSelected ? 'cyan' : undefined}
            marginLeft={constraint.x}
            marginTop={constraint.y}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Text color={isSelected ? 'cyan' : undefined}>{constraint.monitor.name}</Text>
            <Text color={isSelected ? 'cyan' : undefined}>{constraint.monitor.width}x{constraint.monitor.height}@{formatRefreshRate(constraint.monitor.refreshRate)}Hz</Text>
          </Box>
        );
      })}
    </Box>
  );
};
