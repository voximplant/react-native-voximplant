/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Enum of log levels. IOS ONLY
 * @name LogLevel
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
 * @name ClientState
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
 * @name RenderScaleType
 * @memberOf Voximplant
 * @enum {string}
 * @type {{SCALE_FILL: string, SCALE_FIT: string}}
 */
export const RenderScaleType = {
    /** Video frame is scaled to fill the size of the view by maintaining the aspect ratio. Some portion of the video frame may be clipped. */
    SCALE_FILL : 'fill',
    /** Video frame is scaled to be fit the size of the view by maintaining the aspect ratio (black borders may be displayed). */
    SCALE_FIT  : 'fit'
};

/**
 * Call related errors
 * @name CallError
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
 * @name AudioDevice
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
     * Should not be selected via {@link Voximplant.Hardware.AudioDeviceManager#selectAudioDevice}
     */
    NONE          : 'None',
    /** Speaker */
    SPEAKER       : 'Speaker',
    /** Wired headset */
    WIRED_HEADSET : 'WiredHeadset'
};

/**
 * Enum representing camera types
 * @name CameraType
 * @memberOf Voximplant.Hardware
 * @enum {string}
 * @type {{FRONT: string, BACK: string}}
 */
export const CameraType = {
    /**
     * The facing of the camera is the same as that of the screen
     * @memberOf Hardware.CameraType
     */
    FRONT : 'front',
    /**
     * The facing of the camera is opposite to that of the screen
     * @memberOf Hardware.CameraType
     */
    BACK  : 'back'
};

/**
 * Enum representing supported video codecs
 * @name VideoCodec
 * @memberOf Voximplant
 * @enum {string}
 * @type {{VP8: string, H264: string, AUTO: string}}
 */
export const VideoCodec = {
    /**
     * VP8 video codec
     * @memberOf Voximplant.VideoCodec
     */
    VP8  : 'VP8',
    /**
     * H264 video codec
     * @memberOf Voximplant.VideoCodec
     */
    H264 : 'H264',
    /**
     * Video codec for call will be chosen automatically
     * @memberOf Voximplant.VideoCodec
     */
    AUTO : 'AUTO'
};

/**
 * @memberOf Voximplant.Messaging
 * @type {{getUser: string}}
 */
export const MessengerAction = {
    addParticipants: 'addParticipants',
    createConversation : 'createConversation',
    delivered : 'delivered',
    editConversation: 'editConversation',
    editMessage: 'editMessage',
    editParticipants: 'editParticipants',
    editUser : 'editUser',
    getConversation : 'getConversation',
    getConversations : 'getConversations',
    getUser : 'getUser',
    joinConversation: 'joinConversation',
    leaveConversation: 'leaveConversation',
    manageNotifications : 'manageNotifications',
    read: 'read',
    removeConversation : 'removeConversation',
    removeMessage: 'removeMessage',
    removeParticipants: 'removeParticipants',
    retransmitEvents : 'retransmitEvents',
    sendMessage : 'sendMessage',
    setStatus : 'setStatus',
    subscribe : 'subscribe',
    typing : 'typing',
    unsubscribe : 'unsubscribe'
};

/**
 * @memberOf Voximplant.Messaging
 * @type {{EditMessage: string, SendMessage: string}}
 */
export const MessengerNotifications = {
    EditMessage : 'EditMessage',
    SendMessage : 'SendMessage'
};