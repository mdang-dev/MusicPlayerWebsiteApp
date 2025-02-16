'use client'

import React, {useEffect} from "react";
import NavbarServer from "@/components/global/NavbarServer";
import Footer from "@/components/global/Footer";
import Main from "@/components/global/Main";
import SearchBox from "@/components/global/SearchBox";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {useRouter} from "next/navigation";

const RootLayout = ({children}: Readonly<{ children: React.ReactNode; }>) => {

    const router = useRouter();

    const [showSearchBox, setShowSearchBox] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const {
        transcript,
        resetTranscript,
    } = useSpeechRecognition();

    const handleClickSearchVoice = () => {
        if(!SpeechRecognition.browserSupportsSpeechRecognition()) {
            alert('Your browser does not support speech recognition');
            return;
        }
        setShowSearchBox(true);
        resetTranscript();
        SpeechRecognition.startListening({continuous: true, language: 'vi-VN'}).then(r => console.log(r));
    }
    const handleCloseSearchVoice = () => {
        setShowSearchBox(false);
        SpeechRecognition.stopListening().then(r => console.log(r)).catch(err => console.log(err));
    }

    useEffect(() => {
        if(showSearchBox){
            const timer = setTimeout(() => {
                setShowSearchBox(false);
                SpeechRecognition.stopListening().then(r => console.log(r));
                if (transcript){
                    setInputValue(transcript);
                    router.push("/?search=" + transcript);
                }
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [transcript, showSearchBox]);


    return (
        <>
            <NavbarServer value={inputValue} handleClickVoiceSearch={handleClickSearchVoice}/>
            <main className={`flex !bg-bg-body h-[78vh] py-4 w-full relative`}>
                <Main/>
                {children}
                {
                    showSearchBox && (<SearchBox handleClose={handleCloseSearchVoice}/>)
                }
            </main>
            <Footer/>
        </>
    )
}

export default RootLayout;