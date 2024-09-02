import fetch from 'cross-fetch';
import { useEffect, useState } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';

import { useNetworkStatus } from './lib/use-network-status';
import { useHardwareConcurrency } from './lib/use-hardware-concurrency';
import { useMemoryStatus } from './lib/use-memory-status';
import useEvent from './use-event';

const noOp = () => {};
let webVitalsDebug = false;

const webVitalsBase = {
  age: 0,
  type: 'web-vitals',
  url: 'current-page-url',
};

const vitals = { cls: null, lcp: null, fcp: null, ttfb: null };
const deviceMetrics = {
  device_mem: null,
  device_cpu: null,
  device_effective_connection: null,
};

const updateWebVitals = ({ name, value }) => {
  const vitalName = name.toLowerCase();
  vitals[vitalName] = value;
};

const updateDeviceMetrics = ({
  deviceMemory,
  numberOfLogicalProcessors,
  effectiveConnectionType,
}) => {
  deviceMetrics.device_mem = deviceMemory;
  deviceMetrics.device_cpu = numberOfLogicalProcessors;
  deviceMetrics.device_effective_connection = effectiveConnectionType;
};

const setCurrentUrl = () => {
  webVitalsBase.url = window.location.href;
};

const appendReportParams = (reportingEndpoint, reportParams) => {
  const url = new URL(reportingEndpoint);
  const reportParamKeys = Object.keys(reportParams);
  const paramsString = reportParamKeys
    .map(param => `${param}=${reportParams[param]}`)
    .join('&');

  return url.search
    ? `${reportingEndpoint}&${paramsString}`
    : `${reportingEndpoint}?${paramsString}`;
};

const sendBeacon = (rawBeacon, reportingEndpoint, reportParams) => {
  const beacon = JSON.stringify(rawBeacon);
  const beaconTarget = reportParams
    ? appendReportParams(reportingEndpoint, reportParams)
    : reportingEndpoint;

  if (webVitalsDebug === true) {
    console.log('WEBVITALS DEBUG IS ON');
    console.log(`In production, WebVitals data would be sent to ${beaconTarget} with the following payload`);
    console.dir(rawBeacon);
    return new Promise((resolve, reject) => {
        resolve();
    });
  }

  if (navigator.sendBeacon) {
    const headers = { type: 'application/reports+json' };
    const blob = new Blob([beacon], headers);
    return new Promise((resolve, reject) => {
      const beaconResult = navigator.sendBeacon(beaconTarget, blob);
      if (!beaconResult) reject(new Error('Send Beacon failed'));
      resolve();
    });
  }
  return fetch(beaconTarget, {
    method: 'POST',
    headers: { 'Content-Type': 'application/reports+json' },
    body: beacon,
    mode: 'no-cors',
  });
};

const shouldSample = sampleRate => {
  const randomNumber = Math.floor(Math.random() * 100);
  return randomNumber <= sampleRate;
};

const useWebVitals = ({
  enabled,
  reportingEndpoint,
  loggerCallback = noOp,
  sampleRate = 100,
  reportParams,
  webVitalsListener = 'pagehide',
  debug = false,
}) => {
  let pageLoadTime;
  webVitalsDebug = debug;

  const [status, setStatus] = useState({ error: false });
  const shouldSendVitals = enabled && shouldSample(sampleRate);

  const { effectiveConnectionType } = useNetworkStatus();
  const { numberOfLogicalProcessors } = useHardwareConcurrency();
  const { deviceMemory } = useMemoryStatus();

  const sendVitals = () => {
    const pageExitTime = Date.now();
    const pageAge = pageExitTime - pageLoadTime;

    // Last chance to get the CLS before sending the beacon.
    onCLS(updateWebVitals, { reportAllChanges: true });

    const beacon = [
      { ...webVitalsBase, age: pageAge, body: { ...vitals, ...deviceMetrics } },
    ];

    sendBeacon(beacon, reportingEndpoint, reportParams).catch(loggerCallback);
  };

  useEvent(webVitalsListener, shouldSendVitals ? sendVitals : noOp);

  useEffect(() => {
    try {
      pageLoadTime = Date.now();
      setCurrentUrl();
      updateDeviceMetrics({
        effectiveConnectionType,
        numberOfLogicalProcessors,
        deviceMemory,
      });
      onCLS(updateWebVitals, { reportAllChanges: true });
      onLCP(updateWebVitals, { reportAllChanges: true });
      onFCP(updateWebVitals);
      onTTFB(updateWebVitals);
      onINP(updateWebVitals);
    } catch ({ message }) {
      setStatus({ error: true, message });
    }
  }, []);

  return status;
};

export default useWebVitals;
