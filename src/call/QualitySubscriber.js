/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { NativeEventEmitter, NativeModules } from "react-native";

import QualityIssueEvents from "./QualityIssueEvents";


const CallModule = NativeModules.RNVICallModule;

const EventEmitter = new NativeEventEmitter(CallModule);

export default class QualitySubscriber {
  static _instance = null;

  constructor() {
    this.listeners = {};
  }

  on(event, handler) {
    if (!handler || !(handler instanceof Function)) {
        console.warn(`QualityIssue: on: handler is not a Function`);
        return;
    }
    if (Object.values(QualityIssueEvents).indexOf(event) === -1) {
        console.warn(`QualityIssue: on: QualityIssueEvents does not contain ${event} event`);
        return;
    }
    if (!this.listeners[event]) {
        this.listeners[event] = new Set();
    }
    this.listeners[event].add(handler);
  }

  off(event, handler) {
      if (!this.listeners[event]) {
          return;
      }
      if (Object.values(QualityIssueEvents).indexOf(event) === -1) {
          console.warn(`QualityIssue: off: QualityIssueEvents does not contain ${event} event`);
          return;
      }
      if (handler && handler instanceof Function) {
          this.listeners[event].delete(handler);
      } else {
          this.listeners[event] = new Set();
      }
  }
  
  /**
   * @private
   */
  _events = [
    'VIQualityIssuePacketLoss',
    'VIQualityIssueCodecMismatch',
    'VIQualityIssueLocalVideoDegradation',
    'VIQualityIssueIceDisconnected',
    'VIQualityIssueHighMediaLatency',
    'VIQualityIssueNoAudioSignal',
    'VIQualityIssueNoAudioReceive',
    'VIQualityIssueNoVideoReceive'
  ];

    /**
     * @private
     */
     _addEventListeners() {
      this._events.forEach((item) => {
          this[`_${item}Subscriber`] = EventEmitter.addListener(item, this[`_${item}Callback`]);
      });
  }

  /**
   * @private
   */
  _removeEventListeners() {
      this._events.forEach((item) => {
          if(this[`_${item}Subscriber`]) {
              this[`_${item}Subscriber`].remove();
              delete this[`_${item}Subscriber`];
          }
      });
  }
}