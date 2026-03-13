import { useCallback, useEffect, useState } from 'react';
import { queryPort, type Monitor } from '../../hyprland';

export const useMonitors = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);

  const fetchMonitors = useCallback(() => {
    return queryPort.getMonitors().map(setMonitors);
  }, []);

  useEffect(() => {
    fetchMonitors();
  }, []);

  return { monitors, refetch: fetchMonitors };
};
