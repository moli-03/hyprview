import { Box, Newline, Text } from 'ink';
import { Monitor } from '../../hyprland';
import { correctRowAspect } from '../../utils/scaling';

type MonitorSetupProps = {
  monitors: Monitor[];
  width: number;
  height: number;
};

export const MonitorSetup = ({ monitors, width, height }: MonitorSetupProps) => {
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

  return (
    <Box width={width} height={height}>
      {monitorConstraints.map((constraint) => (
        <Box
          key={constraint.monitor.id}
          width={constraint.width}
          height={constraint.height}
          position="absolute"
          borderStyle="round"
          marginLeft={constraint.x}
          marginTop={constraint.y}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Text>{constraint.monitor.name}</Text>
          <Text>{constraint.monitor.width}x{constraint.monitor.height}@{constraint.monitor.refreshRate}Hz</Text>
        </Box>
      ))}
    </Box>
  );
};
