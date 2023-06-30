function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
import fetch from 'cross-fetch';
import { useEffect, useState } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';
import { useNetworkStatus, useHardwareConcurrency, useMemoryStatus } from 'react-adaptive-hooks';
import useEvent from './use-event';
var noOp = function noOp() {};
var webVitalsBase = {
  age: 0,
  type: 'web-vitals',
  url: 'current-page-url'
};
var vitals = {
  cls: null,
  fid: null,
  lcp: null,
  fcp: null,
  ttfb: null
};
var deviceMetrics = {
  device_mem: null,
  device_cpu: null,
  device_effective_connection: null
};
var updateWebVitals = function updateWebVitals(_ref) {
  var name = _ref.name,
    value = _ref.value;
  var vitalName = name.toLowerCase();
  vitals[vitalName] = value;
};
var updateDeviceMetrics = function updateDeviceMetrics(_ref2) {
  var deviceMemory = _ref2.deviceMemory,
    numberOfLogicalProcessors = _ref2.numberOfLogicalProcessors,
    effectiveConnectionType = _ref2.effectiveConnectionType;
  deviceMetrics.device_mem = deviceMemory;
  deviceMetrics.device_cpu = numberOfLogicalProcessors;
  deviceMetrics.device_effective_connection = effectiveConnectionType;
};
var setCurrentUrl = function setCurrentUrl() {
  webVitalsBase.url = window.location.href;
};
var appendReportParams = function appendReportParams(reportingEndpoint, reportParams) {
  var url = new URL(reportingEndpoint);
  var reportParamKeys = Object.keys(reportParams);
  var paramsString = reportParamKeys.map(function (param) {
    return "".concat(param, "=").concat(reportParams[param]);
  }).join('&');
  return url.search ? "".concat(reportingEndpoint, "&").concat(paramsString) : "".concat(reportingEndpoint, "?").concat(paramsString);
};
var sendBeacon = function sendBeacon(rawBeacon, reportingEndpoint, reportParams) {
  var beacon = JSON.stringify(rawBeacon);
  var beaconTarget = reportParams ? appendReportParams(reportingEndpoint, reportParams) : reportingEndpoint;
  if (navigator.sendBeacon) {
    var headers = {
      type: 'application/reports+json'
    };
    var blob = new Blob([beacon], headers);
    return new Promise(function (resolve, reject) {
      var beaconResult = navigator.sendBeacon(beaconTarget, blob);
      if (!beaconResult) reject(new Error('Send Beacon failed'));
      resolve();
    });
  }
  return fetch(beaconTarget, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/reports+json'
    },
    body: beacon,
    mode: 'no-cors'
  });
};
var shouldSample = function shouldSample(sampleRate) {
  var randomNumber = Math.floor(Math.random() * 100);
  return randomNumber <= sampleRate;
};
var useWebVitals = function useWebVitals(_ref3) {
  var enabled = _ref3.enabled,
    reportingEndpoint = _ref3.reportingEndpoint,
    _ref3$loggerCallback = _ref3.loggerCallback,
    loggerCallback = _ref3$loggerCallback === void 0 ? noOp : _ref3$loggerCallback,
    _ref3$sampleRate = _ref3.sampleRate,
    sampleRate = _ref3$sampleRate === void 0 ? 100 : _ref3$sampleRate,
    reportParams = _ref3.reportParams;
  var pageLoadTime;
  var _useState = useState({
      error: false
    }),
    _useState2 = _slicedToArray(_useState, 2),
    status = _useState2[0],
    setStatus = _useState2[1];
  var shouldSendVitals = enabled && shouldSample(sampleRate);
  var _useNetworkStatus = useNetworkStatus(),
    effectiveConnectionType = _useNetworkStatus.effectiveConnectionType;
  var _useHardwareConcurren = useHardwareConcurrency(),
    numberOfLogicalProcessors = _useHardwareConcurren.numberOfLogicalProcessors;
  var _useMemoryStatus = useMemoryStatus(),
    deviceMemory = _useMemoryStatus.deviceMemory;
  var sendVitals = function sendVitals() {
    var pageExitTime = Date.now();
    var pageAge = pageExitTime - pageLoadTime;

    // Last chance to get the CLS before sending the beacon.
    onCLS(updateWebVitals, {
      reportAllChanges: true
    });
    var beacon = [_objectSpread(_objectSpread({}, webVitalsBase), {}, {
      age: pageAge,
      body: _objectSpread(_objectSpread({}, vitals), deviceMetrics)
    })];
    sendBeacon(beacon, reportingEndpoint, reportParams).catch(loggerCallback);
  };
  useEvent('pagehide', shouldSendVitals ? sendVitals : noOp);
  useEffect(function () {
    try {
      pageLoadTime = Date.now();
      setCurrentUrl();
      updateDeviceMetrics({
        effectiveConnectionType: effectiveConnectionType,
        numberOfLogicalProcessors: numberOfLogicalProcessors,
        deviceMemory: deviceMemory
      });
      onCLS(updateWebVitals, {
        reportAllChanges: true
      });
      onFID(updateWebVitals);
      onLCP(updateWebVitals, {
        reportAllChanges: true
      });
      onFCP(updateWebVitals);
      onTTFB(updateWebVitals);
      onINP(updateWebVitals);
    } catch (_ref4) {
      var message = _ref4.message;
      setStatus({
        error: true,
        message: message
      });
    }
  }, []);
  return status;
};
export default useWebVitals;