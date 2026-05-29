import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioMixerContext = createContext();

export const AudioMixerProvider = ({ children }) => {
    // Volume states (0 to 100)
    const [volumes, setVolumes] = useState({
        lofi: 0,
        rain: 0,
        binaural: 0,
        whitenoise: 0
    });
    const [isPlaying, setIsPlaying] = useState({
        lofi: false,
        rain: false,
        binaural: false,
        whitenoise: false
    });

    const audioRefs = useRef({
        lofi: null,
        rain: null,
        ctx: null, // AudioContext for procedural audio
        binauralNodes: null, // Left/Right oscillators + gain
        noiseNode: null, // Noise gain + buffer source
    });

    // Initialize HTML5 Audio elements on mount
    useEffect(() => {
        audioRefs.current.lofi = new Audio('/audio/lofi.mp3');
        audioRefs.current.lofi.loop = true;
        
        audioRefs.current.rain = new Audio('/audio/rain.mp3');
        audioRefs.current.rain.loop = true;

        return () => {
            if (audioRefs.current.lofi) audioRefs.current.lofi.pause();
            if (audioRefs.current.rain) audioRefs.current.rain.pause();
            if (audioRefs.current.ctx) audioRefs.current.ctx.close();
        };
    }, []);

    // Sync volume changes
    useEffect(() => {
        if (audioRefs.current.lofi) {
            audioRefs.current.lofi.volume = volumes.lofi / 100;
        }
    }, [volumes.lofi]);

    useEffect(() => {
        if (audioRefs.current.rain) {
            audioRefs.current.rain.volume = volumes.rain / 100;
        }
    }, [volumes.rain]);

    // Handle procedural sound volumes
    useEffect(() => {
        if (audioRefs.current.binauralNodes && audioRefs.current.ctx) {
            audioRefs.current.binauralNodes.gain.gain.setValueAtTime(
                (volumes.binaural / 100) * 0.15, 
                audioRefs.current.ctx.currentTime
            );
        }
    }, [volumes.binaural]);

    useEffect(() => {
        if (audioRefs.current.noiseNode && audioRefs.current.ctx) {
            audioRefs.current.noiseNode.gain.gain.setValueAtTime(
                (volumes.whitenoise / 100) * 0.08, 
                audioRefs.current.ctx.currentTime
            );
        }
    }, [volumes.whitenoise]);

    const initWebAudio = () => {
        if (!audioRefs.current.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioRefs.current.ctx = new AudioContextClass();
        }
        if (audioRefs.current.ctx.state === 'suspended') {
            audioRefs.current.ctx.resume();
        }
    };

    const startLofi = () => {
        audioRefs.current.lofi.play().catch(e => console.log("Lofi failed", e));
        setIsPlaying(prev => ({ ...prev, lofi: true }));
        if (volumes.lofi === 0) setVolumes(v => ({ ...v, lofi: 50 }));
    };

    const stopLofi = () => {
        audioRefs.current.lofi.pause();
        setIsPlaying(prev => ({ ...prev, lofi: false }));
    };

    const startRain = () => {
        audioRefs.current.rain.play().catch(e => console.log("Rain failed", e));
        setIsPlaying(prev => ({ ...prev, rain: true }));
        if (volumes.rain === 0) setVolumes(v => ({ ...v, rain: 50 }));
    };

    const stopRain = () => {
        audioRefs.current.rain.pause();
        setIsPlaying(prev => ({ ...prev, rain: false }));
    };

    const startBinaural = () => {
        initWebAudio();
        const ctx = audioRefs.current.ctx;
        
        if (audioRefs.current.binauralNodes) return; // Already running

        // Create oscillator left (200Hz) and right (210Hz) for a 10Hz binaural beat (Alpha relaxation)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gainNode = ctx.createGain();

        oscL.frequency.value = 200;
        oscR.frequency.value = 210;

        // Panning Left and Right channels
        const pannerL = ctx.createPanner();
        const pannerR = ctx.createPanner();
        pannerL.panningModel = 'HRTF';
        pannerR.panningModel = 'HRTF';
        pannerL.setPosition(-1, 0, 0);
        pannerR.setPosition(1, 0, 0);

        oscL.connect(pannerL);
        pannerL.connect(gainNode);

        oscR.connect(pannerR);
        pannerR.connect(gainNode);

        gainNode.connect(ctx.destination);
        
        // Initial volume
        const vol = volumes.binaural === 0 ? 30 : volumes.binaural;
        gainNode.gain.value = (vol / 100) * 0.15; // Cap volume for comfort
        if (volumes.binaural === 0) setVolumes(v => ({ ...v, binaural: 30 }));

        oscL.start();
        oscR.start();

        audioRefs.current.binauralNodes = {
            oscL,
            oscR,
            gain: gainNode
        };
        setIsPlaying(prev => ({ ...prev, binaural: true }));
    };

    const stopBinaural = () => {
        if (audioRefs.current.binauralNodes) {
            try {
                audioRefs.current.binauralNodes.oscL.stop();
                audioRefs.current.binauralNodes.oscR.stop();
            } catch (e) {}
            audioRefs.current.binauralNodes.oscL.disconnect();
            audioRefs.current.binauralNodes.oscR.disconnect();
            audioRefs.current.binauralNodes.gain.disconnect();
            audioRefs.current.binauralNodes = null;
        }
        setIsPlaying(prev => ({ ...prev, binaural: false }));
    };

    const startWhiteNoise = () => {
        initWebAudio();
        const ctx = audioRefs.current.ctx;
        
        if (audioRefs.current.noiseNode) return;

        const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise loop
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        // Apply a gentle lowpass filter to make the noise warmer (brown/pink-ish)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        const gainNode = ctx.createGain();
        const vol = volumes.whitenoise === 0 ? 35 : volumes.whitenoise;
        gainNode.gain.value = (vol / 100) * 0.08;
        if (volumes.whitenoise === 0) setVolumes(v => ({ ...v, whitenoise: 35 }));

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start();

        audioRefs.current.noiseNode = {
            source,
            filter,
            gain: gainNode
        };
        setIsPlaying(prev => ({ ...prev, whitenoise: true }));
    };

    const stopWhiteNoise = () => {
        if (audioRefs.current.noiseNode) {
            try {
                audioRefs.current.noiseNode.source.stop();
            } catch (e) {}
            audioRefs.current.noiseNode.source.disconnect();
            audioRefs.current.noiseNode.filter.disconnect();
            audioRefs.current.noiseNode.gain.disconnect();
            audioRefs.current.noiseNode = null;
        }
        setIsPlaying(prev => ({ ...prev, whitenoise: false }));
    };

    const stopAll = () => {
        stopLofi();
        stopRain();
        stopBinaural();
        stopWhiteNoise();
    };

    const isGlobalPlaying = isPlaying.lofi || isPlaying.rain || isPlaying.binaural || isPlaying.whitenoise;

    return (
        <AudioMixerContext.Provider value={{
            volumes,
            setVolumes,
            isPlaying,
            isGlobalPlaying,
            startLofi,
            stopLofi,
            startRain,
            stopRain,
            startBinaural,
            stopBinaural,
            startWhiteNoise,
            stopWhiteNoise,
            stopAll
        }}>
            {children}
        </AudioMixerContext.Provider>
    );
};

export const useAudioMixer = () => useContext(AudioMixerContext);
