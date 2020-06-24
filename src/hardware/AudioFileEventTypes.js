/*
 * Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
 */

/**
 * Audio file events listener to be notified about audio file events
 * @memberof Voximplant.Hardware
 * @enum {string}
 * @type {{Started: string, Stopped: string}}
 */
const AudioFileEventTypes = {
    /**
     * Invoked when the audio file playing is started.
     * Handler function receives {@link EventHandlers.AudioFileStarted} object as an argument.
     */
    Started: 'Started',
    /**
     * Invoked when the audio file playing is stopped.
     * Handler function receives {@link EventHandlers.AudioFileStopped} object as an argument.
     */
    Stopped: 'Stopped'
};

export default AudioFileEventTypes;
