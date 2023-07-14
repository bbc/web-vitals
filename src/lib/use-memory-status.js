let unsupported;
if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
  unsupported = false;
} else {
  unsupported = true;
}
let memoryStatus;
if (!unsupported) {
  const performanceMemory = 'memory' in performance ? performance.memory : null;
  memoryStatus = {
    unsupported,
    deviceMemory: navigator.deviceMemory,
    totalJSHeapSize: performanceMemory
      ? performanceMemory.totalJSHeapSize
      : null,
    usedJSHeapSize: performanceMemory ? performanceMemory.usedJSHeapSize : null,
    jsHeapSizeLimit: performanceMemory
      ? performanceMemory.jsHeapSizeLimit
      : null
  };
} else {
  memoryStatus = { unsupported };
}

const useMemoryStatus = initialMemoryStatus => {
  return unsupported && initialMemoryStatus
    ? { ...memoryStatus, ...initialMemoryStatus }
    : { ...memoryStatus };
};

export { useMemoryStatus };