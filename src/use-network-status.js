import { useState, useEffect } from 'react';

let unsupported;

const useNetworkStatus = initialEffectiveConnectionType => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator && 'effectiveType' in navigator.connection) {
    unsupported = false;
  } else {
    unsupported = true;
  }

  const initialNetworkStatus = {
    unsupported,
    effectiveConnectionType: unsupported
      ? initialEffectiveConnectionType
      : navigator.connection.effectiveType
  };

  const [networkStatus, setNetworkStatus] = useState(initialNetworkStatus);

  useEffect(() => {
    if (!unsupported) {
      const navigatorConnection = navigator.connection;
      const updateECTStatus = () => {
        setNetworkStatus({
          effectiveConnectionType: navigatorConnection.effectiveType
        });
      };
      navigatorConnection.addEventListener('change', updateECTStatus);
      return () => {
        navigatorConnection.removeEventListener('change', updateECTStatus);
      };
    }
  }, []);

  return { ...networkStatus, setNetworkStatus };
};

export { useNetworkStatus };