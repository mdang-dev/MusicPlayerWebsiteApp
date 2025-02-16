"use client"

import React, {useState} from "react";
import {
    Bell,
    Pause,
    Play,
    SkipBack,
    SkipForward,
    Repeat,
    Repeat1
} from "lucide-react";
import {useAudio} from "@/app/Provider/AudioContext";


const Footer: React.FC = () => {

    const { volume, setVolume, repeat, setRepeat, indexPlaying, setIsPlaying, togglePlayPauseAudio, songData } = useAudio();

    const {audioReady, currentSong, durationSong, currentTime, isPlaying, loadAudio} = useAudio();

    const [stateRepeat, setStateRepeat ]= useState<boolean>(true);

    const format = (duration: number): string => {
        return String(Math.floor(duration)).padStart(2, '0');
    }

    const toggleRepeat = () => {
        if(repeat === 2 ) {
            setRepeat(0);
        }else{
            setRepeat(repeat + 1);
        }
    }
    const calculateProgress = () => Math.floor(((currentTime / durationSong)* 100));

    const handlePlayMusicProgressBar = () => {
        togglePlayPauseAudio();
    }

    const nextSong = () => {
        let index = songData.findIndex((song) => song.songId === indexPlaying);
        loadAudio(index < songData.length - 1 ? songData[++index] : songData[0]);
    }

    const handleNextSong = () => {
        if(repeat === 0 ) {
            nextSong();
        }else if(repeat === 1) {
            if(stateRepeat){
                setStateRepeat(false);
                loadAudio(currentSong!);
            }else {
                nextSong();
                setStateRepeat(true);
            }
        }else {
            loadAudio(currentSong!);
        }
    }


    const prevSong = () => {
        let index = songData.findIndex((song) => song.songId === indexPlaying);
        loadAudio(index > 0 ? songData[--index] : songData[songData.length - 1]);
    }

    const handlePrevSong = () => {
       if(repeat === 0 ) {
           prevSong();
        }else if(repeat === 1) {
            if(stateRepeat){
                setStateRepeat(false);
                loadAudio(currentSong!);
            }else {
                prevSong();
                setStateRepeat(true);
            }
        }else {
            loadAudio(currentSong!);
        }
    }

    if(audioReady.current && currentSong) {
        audioReady.current.volume = volume;
        audioReady.current.addEventListener('ended', () => {
            if(repeat === 0 ) {
                handleNextSong();
            }else if(repeat === 1) {
                if(stateRepeat){
                    setStateRepeat(false);
                    loadAudio(currentSong!);
                }else {
                    handleNextSong();
                    setStateRepeat(true);
                }
            }else {
                loadAudio(currentSong!);
            }
        });
    }

    return (

        <footer
            className="w-full h-20 bg-black fixed bottom-0 flex justify-between items-center truncate">
            <section
                className="basic-2/8 flex items-center w-[20%] ml-[30px]">
                <div className="flex w-20 h-[60px] mt-[2px] rounded-md">
                    <img src={`${process.env.NEXT_PUBLIC_API}${currentSong?.coverPhoto}`}
                         className={`rounded-md w-[60px] h-[60px] object-cover object-center ${currentSong ? `` : `hidden`}`}
                         id="img-song" alt={"img"}/>
                </div>

                <div className="mt-3">
                    <h2
                        className="text-[#fff] text-[14px] font-bold font-Roboto w-30 truncate"
                        id="title-song">
                        {currentSong?.songName}
                    </h2>
                    <h5 className="text-[#b1b1b1] text-[11px] w-30 truncate"
                        id="artist-song">
                        { currentSong && (currentSong?.artistSongs as unknown as { artist: { artistName: string } }[]).map((e) => (e.artist.artistName)).join(', ')}
                    </h5>
                </div>
            </section>
            <section className="basis-4/8 grid place-items-center mr-[10%] mt-1">
                <div
                    className="flex justify-center gap-6 items-center mt-1 ml-10">
                    <div>
                        <SkipBack
                            className={`fas fa-step-backward text-white cursor-pointer ${audioReady.current!.src ? `` : `pointer-events-none opacity-50`}`}
                            onClick={handlePrevSong}/>
                    </div>
                    <div
                        className={`w-[35px] h-[35px] rounded-[100%] bg-white border-2 border-solid border-white grid place-items-center place-content-center ${audioReady.current!.src ? `` : `pointer-events-none opacity-50`}`}
                        onClick={handlePlayMusicProgressBar}>
                        {!isPlaying ? (<Play fill={`full`}
                            className={`text-black text-xs cursor-pointer ${audioReady.current!.src ? `` : `pointer-events-none opacity-50`}`}
                            size={20}
                        />) : (<Pause fill={`full`} className="text-black text-xs cursor-pointer mr-[0.5px]" size={20}
                        />)}

                    </div>
                    <div>
                        <SkipForward
                            className={`fas fa-step-forward text-white text-2xl cursor-pointer ${audioReady.current!.src ? `` : `pointer-events-none opacity-50`}`}
                            onClick={handleNextSong}/>
                    </div>
                    <div className={`pl-3 cursor-pointer ${audioReady.current!.src ? `` : `pointer-events-none opacity-50`}`} onClick={toggleRepeat}>
                        {
                            repeat === 0 || repeat === 1 ? (
                                <Repeat color={`${repeat === 0 ? `white` : `red`}`} size={20} />
                            ) : (
                                <Repeat1 color={`red`} size={20}/>
                            )
                        }
                    </div>
                </div>
                <div className="flex gap-3 justify-center items-center">
                    <span className="text-white" id="time-start">{audioReady.current?.src && !isNaN(currentTime) ? `${format(currentTime / 60)}:${format(currentTime % 60)}` : `00:00`}</span>
                    <div className="relative w-max">
                        <div
                            className={`line bg-white absolute w-0 h-1  bottom-0 left-0 top-[13.5px] rounded-lg pointer-events-none`}
                            id={`line-progress-bar`} style={{
                            width: `${calculateProgress()}%`}}></div>
                        <input type="range"
                               className={`ct-range cursor-pointer ${audioReady.current?.src ? `` : `pointer-events-none opacity-50`}`} min="0"
                               max="100" value={calculateProgress() ? calculateProgress() : 0} id="progress-bar" onChange={(e) => {
                            audioReady.current!.currentTime = Number((Number(e.target.value) / 100) * durationSong);
                        }}/>
                    </div>
                    <span className="text-white" id="time-end">{audioReady.current?.src && !isNaN(durationSong) ? `${format(durationSong / 60)}:${format(durationSong % 60)}` : `00:00`}</span>
                </div>
            </section>

            <section className="flex justify-center items-center gap-3 mr-8">

                <div>
                    <Bell className={'rotate-[270deg] text-white'} size={20}/>
                </div>

                <div className="relative w-max">
                    <div
                        className={`line absolute bg-white bottom-0 left-0 top-[15px] rounded-lg pointer-events-none h-[3px] mt-[1px]`}
                        id="line-volume" style={{width: `${volume * 100}%`}}></div>
                    <input type="range" className="volumn w-20 mb-3 h-[3px] mt-[15.5px] cursor-pointer bg-[#484747]"
                           value={volume} step="0.1" min="0" id={`progress-volume`}
                           max="1" onChange={(e) => setVolume(Number(e.target.value))}/>
                </div>
            </section>
        </footer>

    );
};

export default Footer;