import React from "react";
import {useRouter} from "next/navigation";
import Navbar from "@/components/global/Navbar";

type PageProps = {
    value?: string;
    handleClickVoiceSearch?: () => void;
}

const NavbarServer = ({value, handleClickVoiceSearch}:PageProps) => {

    const router = useRouter();

    const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {

        const search = e.target.value;
        if (search === "") {
            router.push("/");
        } else {
            router.push("/?search=" + e.target.value);
        }
    }

    return (
        <Navbar handleSearchQuery={handleSearchQuery} value={value} handleClickVoiceSearch={handleClickVoiceSearch}/>
    )
}

export default NavbarServer;