"use client"

import {Mic, X} from "lucide-react";

type PageProps = {
    handleClose?: () => void;
}

function BoxSearch({ handleClose } : PageProps) {
    return (
        <div className={`bg-[#373737] rounded-md shadow-lg shadow-gray-900 w-[300px] h-[300px] absolute translate-x-[-50%] translate-y-[-70%] left-[50%] top-[50%]`}>
            <header className={`p-5 flex justify-between text-white`}>
                <span>Listening...</span>
                <X className={`cursor-pointer`} onClick={handleClose}/>
            </header>
            <main className={`relative`}>
                <button id="speech" className="btn absolute translate-x-[-50%] translate-y-[80%] left-[50%] top-[50%]">
                    <div className="pulse-ring flex"></div>
                    <Mic size={30} className={`absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]`}/>
                </button>
            </main>
        </div>
    )
}

export default BoxSearch;
