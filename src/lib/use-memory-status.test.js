import { renderHook } from '@testing-library/react';

afterEach(function() {
  // Reload hook for every test
  jest.resetModules();
});

const getMemoryStatus = currentResult => ({
  unsupported: false,
  deviceMemory: currentResult.deviceMemory,
  totalJSHeapSize: currentResult.totalJSHeapSize,
  usedJSHeapSize: currentResult.usedJSHeapSize,
  jsHeapSizeLimit: currentResult.jsHeapSizeLimit
});

describe('useMemoryStatus', () => {
  test(`should return "true" for unsupported case`, () => {
    const { useMemoryStatus } = require('./use-memory-status.js');
    const { result } = renderHook(() => useMemoryStatus());

    expect(result.current.unsupported).toBe(true);
  });

  test('should return initialMemoryStatus for unsupported case', () => {
    const mockInitialMemoryStatus = {
      deviceMemory: 4
    };
    const { deviceMemory } = mockInitialMemoryStatus;

    const { useMemoryStatus } = require('./use-memory-status.js');
    const { result } = renderHook(() =>
      useMemoryStatus(mockInitialMemoryStatus)
    );

    expect(result.current.unsupported).toBe(true);
    expect(result.current.deviceMemory).toEqual(deviceMemory);
  });

  test('should return mockMemory status', () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
      totalJSHeapSize: 60,
      usedJSHeapSize: 40,
      jsHeapSizeLimit: 50
    };

    global.navigator.deviceMemory = mockMemoryStatus.deviceMemory;

    global.window.performance.memory = {
      totalJSHeapSize: mockMemoryStatus.totalJSHeapSize,
      usedJSHeapSize: mockMemoryStatus.usedJSHeapSize,
      jsHeapSizeLimit: mockMemoryStatus.jsHeapSizeLimit
    };

    const { useMemoryStatus } = require('./use-memory-status.js');
    const { result } = renderHook(() => useMemoryStatus());

    expect(getMemoryStatus(result.current)).toEqual({
      ...mockMemoryStatus,
      unsupported: false
    });
  });

  test('should return mockMemory status without performance memory data', () => {
    const mockMemoryStatus = {
      deviceMemory: 4
    };

    global.navigator.deviceMemory = mockMemoryStatus.deviceMemory;
    delete global.window.performance.memory;

    const { useMemoryStatus } = require('./use-memory-status.js');
    const { result } = renderHook(() => useMemoryStatus());

    expect(result.current.deviceMemory).toEqual(mockMemoryStatus.deviceMemory);
    expect(result.current.unsupported).toEqual(false);
  });

  test('should not return initialMemoryStatus for supported case', () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
      totalJSHeapSize: 60,
      usedJSHeapSize: 40,
      jsHeapSizeLimit: 50
    };
    const mockInitialMemoryStatus = {
      deviceMemory: 4
    };

    global.navigator.deviceMemory = mockMemoryStatus.deviceMemory;

    global.window.performance.memory = {
      totalJSHeapSize: mockMemoryStatus.totalJSHeapSize,
      usedJSHeapSize: mockMemoryStatus.usedJSHeapSize,
      jsHeapSizeLimit: mockMemoryStatus.jsHeapSizeLimit
    };

    const { useMemoryStatus } = require('./use-memory-status.js');
    const { result } = renderHook(() =>
      useMemoryStatus(mockInitialMemoryStatus)
    );

    expect(getMemoryStatus(result.current)).toEqual({
      ...mockMemoryStatus,
      unsupported: false
    });
  });
});