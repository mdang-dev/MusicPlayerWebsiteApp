import {
    House,
    Music,
    Heart,
    ListMusic,
} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const Main = () =>  {

    const path  = usePathname();

    return (

        <main className={``}>
            <div
                className="w-[75px] h-[73vh] mx-6 text-white bg-rgb-menu rounded-lg flex flex-col justify-start items-center gap-8 py-10"
                id="menuIcon">
                <div className={`cursor-pointer ${path === '/' ? `border-rectangle` : ``}`}>
                    <Link href={"/"}>
                        <House size={30}/>
                    </Link>
                </div>
                <div className={`cursor-pointer ${path === '/pages/music' ? `border-rectangle` : ``}`}>
                    <Link href={"/pages/music"}>
                        <Music size={30}/>
                    </Link>
                </div>
                <div className={`cursor-pointer ${path === '/pages/liked-songs' ? `border-rectangle` : ``}`}>
                    <Link href={"/pages/liked-songs"}>
                        <Heart size={30}/>
                    </Link>
                </div>
                <div className={`cursor-pointer ${path === '/pages/playlists' || path.includes('playlist-me') ? `border-rectangle` : ``}`}>
                    <Link href={"/pages/playlists"}>
                        <ListMusic size={30}/>
                    </Link>
                </div>
            </div>
        </main>

    );
}

export default Main;