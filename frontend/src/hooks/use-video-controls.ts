"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseVideoControlsReturn {
  isPlaying: boolean;
  // isLoading: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  handleVideoToggle: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
}

export function useVideoControls(): UseVideoControlsReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Add event listeners to video element to track playing state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePauseOrEnded = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePauseOrEnded);
    video.addEventListener("ended", handlePauseOrEnded);
    // video.addEventListener("waiting", () => setIsLoading(true));
    // video.addEventListener("playing", () => setIsLoading(false));
    // video.addEventListener("loadeddata", () => setIsLoading(false));
    // video.addEventListener("loadstart", () => setIsLoading(true));

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePauseOrEnded);
      video.removeEventListener("ended", handlePauseOrEnded);
      // video.removeEventListener("waiting", () => setIsLoading(true));
      // video.removeEventListener("playing", () => setIsLoading(false));
      // video.removeEventListener("loadeddata", () => setIsLoading(false));
      // video.removeEventListener("loadstart", () => setIsLoading(true));
    };
  }, []);

  const handleVideoToggle = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const play = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const pause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const reset = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  return {
    isPlaying,
    videoRef,
    handleVideoToggle,
    play,
    pause,
    reset,
  };
}
