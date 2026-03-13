import { Monitor } from "../../hyprland";
import { Box, Text } from "ink";
export const MonitorShort = ({ monitor }: { monitor: Monitor }) => {
  return (
    <Box flexDirection="row" gap={2}>
      <Text color="green">({ monitor.id }) { monitor.name }:</Text>
      <Text>{ monitor.description }</Text>
    </Box>
  );
}