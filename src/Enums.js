/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Enum of log levels. IOS ONLY
 * @memberOf Voximplant
 * @enum {string}
 * @type {{ERROR: string, WARNING: string, INFO: string, DEBUG: string, VERBOSE: string, MAX: string}}
 */
export const LogLevel = {
    /**
     * Log verbosity level, to include only error messages
     */
    ERROR: "error",
    /**
     * Log verbosity level to include warning messages
     */
    WARNING: "warning",
    /**
     * Default log verbosity level, to include informational messages
     */
    INFO: "info",
    /**
     * Log verbosity level to include debug messages
     */
    DEBUG: "debug",
    /**
     * Log verbosity level to include verbose messages
     */
    VERBOSE: "verbose",
    /**
     * Log verbosity level to include all types of messages
     */
    MAX: "max"
};

/**
 * The client states
 * @memberOf Voximplant
 * @enum {string}
 * @type {{DISCONNECTED: string, CONNECTING: string, CONNECTED: string, LOGGING_IN: string, LOGGED_IN: string}}
 */
export const ClientState = {
    /** The client is currently disconnected */
    DISCONNECTED : "disconnected",
    /** The client is currently connecting */
    CONNECTING   : "connecting",
    /** The client is currently connected */
    CONNECTED    : "connected",
    /** The client is currently logging in */
    LOGGING_IN   : "logging_in",
    /** The client is currently logged in */
    LOGGED_IN    : "logged_in"
};

/**
 * Types of video rendering scaling
 * @memberOf Voximplant
 * @enum {string}
 * @type {{SCALE_FILL: string, SCALE_FIT: string}}
 */
export const RenderScaleType = {
    SCALE_FILL : 'fill',
    SCALE_FIT  : 'fit'
};

/**
 * Call related errors
 * @memberOf Voximplant
 * @enum {string}
 * @type {{ALREADY_IN_THIS_STATE: string, FUNCTIONALITY_IS_DISABLED: string, INCORRECT_OPERATION: string, INTERNAL_ERROR: string, MEDIA_IS_ON_HOLD: string, MISSING_PERMISSION: string, REJECTED: string, TIMEOUT: string}}
 */
export const CallError = {
    /** The call is already in requested state */
    ALREADY_IN_THIS_STATE     : 'ALREADY_IN_THIS_STATE',
    /** Requested functionality is disabled */
    FUNCTIONALITY_IS_DISABLED : 'FUNCTIONALITY_IS_DISABLED',
    /** Operation is incorrect, for example reject outgoing call */
    INCORRECT_OPERATION       : 'INCORRECT_OPERATION',
    /** Internal error occured */
    INTERNAL_ERROR            : 'INTERNAL_ERROR',
    /** Operation can't be performed due to the call is on hold. Unhold the call and repeat the operation */
    MEDIA_IS_ON_HOLD          : 'MEDIA_IS_ON_HOLD',
    /** Operation can't be performed due to missing permission */
    MISSING_PERMISSION        : 'MISSING_PERMISSION',
    /** Operation is rejected */
    REJECTED                  : 'REJECTED',
    /** Operation is not completed in time */
    TIMEOUT                   : 'TIMEOUT'
};

/**
 * Enum representing audio devices
 * @memberOf Voximplant.Hardware
 * @enum {string}
 * @type {{BLUETOOTH: string, EARPIECE: string, NONE: string, SPEAKER: string, WIRED_HEADSET: string}}
 */
export const AudioDevice = {
    /** Bluetooth headset */
    BLUETOOTH     : 'Bluetooth',
    /** Earpiece */
    EARPIECE      : 'Earpiece',
    /** No audio device, generally indicates that something is wrong with audio device selection.
     * Should not be selected via {@link AudioDeviceManger#selectAudioDevice}
     */
    NONE          : 'None',
    /** Speaker */
    SPEAKER       : 'Speaker',
    /** Wired headset */
    WIRED_HEADSET : 'WiredHeadset'
};

/**
 * Enum representing camera types
 * @memberOf Voximplant.Hardware
 * @enum {string}
 * @type {{FRONT: string, BACK: string}}
 */
export const CameraType = {
    /**
     * The facing of the camera is the same as that of the screen
     */
    FRONT : 'front',
    /**
     * The facing of the camera is opposite to that of the screen
     */
    BACK  : 'back'
};