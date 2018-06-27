/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Enum of log levels. IOS ONLY
 * @enum {string}
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

export const ClientState = {
    DISCONNECTED : "disconnected",
    CONNECTING   : "connecting",
    CONNECTED    : "connected",
    LOGGING_IN   : "logging_in",
    LOGGED_IN    : "logged_in"
};

export const RenderScaleType = {
    SCALE_FILL : 'fill',
    SCALE_FIT  : 'fit'
};

export const CallError = {
    ALREADY_IN_THIS_STATE     : 'ALREADY_IN_THIS_STATE',
    FUNCTIONALITY_IS_DISABLED : 'FUNCTIONALITY_IS_DISABLED',
    INCORRECT_OPERATION       : 'INCORRECT_OPERATION',
    INTERNAL_ERROR            : 'INTERNAL_ERROR',
    MEDIA_IS_ON_HOLD          : 'MEDIA_IS_ON_HOLD',
    MISSING_PERMISSION        : 'MISSING_PERMISSION',
    REJECTED                  : 'REJECTED',
    TIMEOUT                   : 'TIMEOUT'
};

export const AudioDevice = {
    BLUETOOTH     : 'Bluetooth',
    EARPIECE      : 'Earpiece',
    NONE          : 'None',
    SPEAKER       : 'Speaker',
    WIRED_HEADSET : 'WiredHeadset'
};

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