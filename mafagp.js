// Mini program to convert phone into sonic support.

var initializedtone = false

async function initializetone() {
    if (initializedtone) {
        return;
    }
    console.log("initialize program")
    await Tone.start();
    Tone.getTransport().start();
    initializedtone = true;
}

// valid global program states
const program_states = {
    "started": 0,
    "stopped": 1
}

var program_state = program_states.stopped

function program_start(part, pl, pwl) {
    if (program_state == program_states.started) {
        console.log("can't start program if already started")
        return;
    }
    pitch_list = pl
    pitch_weight_list = pwl
    program_set_state("started", part);
}

function program_stop() {
    if (program_state == program_states.stopped) {
        console.log("can't stop program if not yet started")
        return;
    }
    program_set_state("stopped");
}

function program_set_state(state, part) {
    console.log("program: set state to '", state, "'")
    var statedisplay = document.querySelector("#statedisplay");
    var statetext = "program state: '" + state + "'"
    if (part) {
        statetext = statetext + " (" + part + ")"
    }
    statedisplay.innerHTML = statetext
    program_state = program_states[state];
}

// Define all states that, our synth could be in.
const synth_states = {
    "started": 0,
    "stopped": 1,
    "fadein": 2,
    "fadeout": 3
}

// global states
var synth_state = synth_states.stopped
var switch_time = Tone.now();

// control duration of synth
var play_duration = 5
var stop_duration = 2
var fadein_duration = 2
var fadeout_duration = 2

var min_fadein_duration = 4
var max_fadein_duration = 12

var min_fadeout_duration = 4
var max_fadeout_duration = 12

var min_stop_duration = 0.1
var max_stop_duration = 5

var min_play_duration = 4
var max_play_duration = 15

// map frequency => likelihood
var pitch_list = [330, 440.0, 660.0, 880.0];
var pitch_weight_list = [1, 2, 2, 1];

// global synth
var synth = new Tone.Synth().toDestination();
var synth_is_pitched = true
var synth_pitch_weight = 0.7 // if 1 => only pitch; if 0 => only noise

function set_synth(fadein_duration, fadeout_duration) {
    if (synth_state != synth_states.stopped) {
        console.log("can't set synth while playing!")
        return;
    }
    synth.dispose();


    // https://tonejs.github.io/docs/15.0.4/interfaces/EnvelopeOptions.html
    // https://github.com/Tonejs/Tone.js/blob/cf73c2287/Tone/component/envelope/Envelope.ts#L561-L567
    const envelope = {attack: fadein_duration, release: fadeout_duration, sustain: 1, releaseCurve: "linear"}
    if (Math.random() < synth_pitch_weight) {
        synth = new Tone.Synth(
            {
                oscillator: {type: "sine1"},
                envelope: envelope
            }
        ).toDestination();
        synth_is_pitched = true;
        synth.volume.value = -12;
    } else {
        synth = new Tone.NoiseSynth({envelope: envelope}).toDestination();
        synth_is_pitched = false;
        synth.volume.value = -35;
    }
}

// Functions to switch state of synth

function set_fadein(time) {
    set_synth_tempo()

    set_synth(fadein_duration, fadeout_duration)
    set_state(time, "fadein")
    if (synth_is_pitched) {
        synth.triggerAttack(get_pitch(), time);
    } else {
        synth.triggerAttack(time);
    }
}

function set_fadeout(time) {
    set_state(time, "fadeout")
    synth.triggerRelease(time);
}

function set_started(time) {
    set_state(time, "started")
}

function set_stopped(time) {
    set_state(time, "stopped")
}

function set_state(time, state) {
    console.log("synth: set state to '", state, "'")
    switch_time = time;
    synth_state = synth_states[state];
    var statedisplay = document.querySelector("#synthstatedisplay");
    statedisplay.innerHTML = "synth state: '" + state + "'"
}

// Control synth

function set_synth_tempo() {
    fadein_duration = getRndInteger(min_fadein_duration * 100, max_fadein_duration * 100) / 100
    fadeout_duration = getRndInteger(min_fadeout_duration * 100, max_fadeout_duration * 100) / 100
    play_duration = getRndInteger(min_play_duration * 100, max_play_duration * 100) / 100
    // make noise shorter than pitch signal
    if (!synth_is_pitched) {
        play_duration = play_duration * 0.75
        fadein_duration = fadein_duration * 0.75
        fadeout_duration = fadeout_duration * 0.75
    }
    stop_duration = getRndInteger(min_stop_duration * 100, max_stop_duration * 100) / 100
}

function get_pitch() {
    return weighted_random(pitch_list, pitch_weight_list);
}

// Global main loop
const loop = new Tone.Loop((time) => {
    // No procressing anymore if program is stopped.
    if ((program_state == program_states.stopped) && (synth_state == synth_states.stopped)) {
        return;
    }
    var delta = time - switch_time
    if (synth_state == synth_states.fadein) {
        if (delta > fadein_duration) {
            set_started(time);
        }
        return;
    } else if (synth_state == synth_states.fadeout) {
        if (delta > fadeout_duration) {
            set_stopped(time);
        }
        return;
    // Do you want to stop?
    } else if (synth_state == synth_states.started) {
        if ((delta > play_duration) || (program_state == program_states.stopped)) {
            set_fadeout(time);
        }
        return;
    // Do you want to start?
    } else if (synth_state == synth_states.stopped) {
        if (delta > stop_duration) {
            set_fadein(time);
        }
        return;
    }
}, "64n").start(0);

// UTILITIES

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

// https://stackoverflow.com/a/55671924
function weighted_random(items, weights) {
    var i;
    for (i = 1; i < weights.length; i++)
        weights[i] += weights[i - 1];
    var random = Math.random() * weights[weights.length - 1];
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    return items[i];
}

