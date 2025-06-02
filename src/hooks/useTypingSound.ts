import { useEffect, useRef } from "react";

interface UseTypingSoundParams {
  enabled?: boolean;
}

export function useTypingSound({ enabled = true }: UseTypingSoundParams = {}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const lastPlayTimeRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const loadAudio = async () => {
      try {
        audioContextRef.current = new AudioContext();
        const response = await fetch("/sounds/typing.mp3");
        const arrayBuffer = await response.arrayBuffer();

        if (!audioContextRef.current) return;

        const decodedData = await audioContextRef.current.decodeAudioData(arrayBuffer);
        audioBufferRef.current = decodedData;
      } catch (error) {
        console.error("Failed to load typing sound:", error);
      }
    };

    loadAudio();

    return () => {
      audioContextRef.current?.close();
    };
  }, [enabled]);

  const playTypingSound = () => {
    if (!enabled || !audioContextRef.current || !audioBufferRef.current) return;

    const now = Date.now();
    if (now - lastPlayTimeRef.current < 60) return; // Prevent too frequent plays
    lastPlayTimeRef.current = now;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  const checkPlayTypingSound = (e: React.KeyboardEvent) => {
    // Only play sound for regular character input
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      playTypingSound();
      return true;
    }
    return false;
  };

  return {
    playTypingSound,
    checkPlayTypingSound,
  };
}
