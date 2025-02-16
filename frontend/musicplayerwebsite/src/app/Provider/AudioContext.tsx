"use client"
import {Song} from "@/data/model/song.model";
import React, {FC, useContext, useEffect, useRef, useState} from "react";
import {createContext} from "react";
import axios from "axios";

type AudioContextProps = {
    currentSong: Song | null;
    setCurrentSong: React.Dispatch<React.SetStateAction<Song | null>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    indexPlaying: number;
    audioReady: React.RefObject<HTMLAudioElement>;
    loadAudio: (song: Song) => void;
    togglePlayPauseAudio: () => void;
    currentTime: number;
    durationSong: number;
    songData: Song[];
    setSongData: React.Dispatch<React.SetStateAction<Song[]>>;
    volume: number;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
    repeat: number;
    setRepeat: React.Dispatch<React.SetStateAction<number>>;
}
const globalAudioInstance = new Audio();

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

const AudioProvider : FC<{children: React.ReactNode}> = ({children}) => {

    const audioReady = useRef<HTMLAudioElement>(globalAudioInstance);
    const [indexPlaying, setIndexPlaying] = useState<number>(-1);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [durationSong, setDurationSong] = useState<number>(0);
    const [songData, setSongData] = useState<Song[]>([]);
    const [volume, setVolume] = useState<number>(0.8);
    const [repeat, setRepeat] = useState<number>(0);

    useEffect(() => {
        const audio = audioReady.current;
        const handleMetadata = () => setDurationSong(audio.duration);
        const updateTime = () => setCurrentTime(audio.currentTime);
        audio.addEventListener("loadedmetadata", handleMetadata);
        audio.addEventListener("timeupdate", updateTime);
    }, []);


    const loadAudio =  (song: Song) => {
        if(song){
            setDurationSong(audioReady.current.duration);
            const check = indexPlaying !== song.songId;
            if(check || repeat === 1 || repeat === 2){
                setIsPlaying(false);
                setIsPlaying((prev) => !prev);
                setCurrentSong(song);
                setIndexPlaying(song.songId!);
                audioReady.current.src = `${process.env.NEXT_PUBLIC_API}` +  song.filePath!;
                audioReady.current
                    .play()
                    .catch((error) => {
                        console.log(error.message);
                    });
            }else {
                togglePlayPauseAudio();
            }
        }
    }

    const togglePlayPauseAudio = () => {
        setIsPlaying((prev) => !prev);
        if(audioReady.current.src){
            if(audioReady.current.paused)
                audioReady.current.play()
                    .catch((error) => {
                        console.log(error.message);
                    });
            else
                audioReady.current.pause();
        }
    }

    useEffect(() => {
        const updatePlays = () => {
          if(audioReady.current.src !== '' && audioReady.current.played){
              let time:number = 30;
              const calculateTime = setInterval(() => {
                  --time;
                  if(time === 0) {
                      clearInterval(calculateTime);
                      axios.put(`${process.env.NEXT_PUBLIC_API}/api/update-plays`, {
                        songId: indexPlaying
                      }).catch(function (err) {
                          console.log(err);
                      })
                  }
              }, 1000);
          }
        }
        updatePlays();
    }, [audioReady.current.src]);

    return (
        <AudioContext.Provider
            value={{
                currentSong,
                setCurrentSong,
                isPlaying,
                setIsPlaying,
                audioReady,
                loadAudio,
                indexPlaying,
                togglePlayPauseAudio,
                currentTime,
                durationSong,
                songData,
                setSongData,
                volume,
                setVolume,
                repeat,
                setRepeat
            }}>
            {children}
        </AudioContext.Provider>
    );
}

export const useAudio = (): AudioContextProps => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}

export default AudioProvider;
