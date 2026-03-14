import { useCallback, useEffect, useState } from "react";
import { queryPort, type Monitor, type MonitorConfiguration } from "../../hyprland";

export const useMonitors = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [defaultMonitorConfiguration, setDefaultMonitorConfiguration] = useState<
    MonitorConfiguration[]
  >([]);

  const fetchDefaultMonitorConfiguration = useCallback(() => {
    return queryPort.getMonitorConfigurations().map(setDefaultMonitorConfiguration);
  }, []);

  const fetchMonitors = useCallback(() => {
    return queryPort.getMonitors().map(setMonitors);
  }, []);

  useEffect(() => {
    fetchMonitors();
    fetchDefaultMonitorConfiguration();
  }, []);

  return {
    monitors,
    defaultMonitorConfiguration,
    refetch: fetchMonitors,
  };
};
