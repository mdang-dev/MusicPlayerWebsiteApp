"use client"

import Logo from "../../../public/images/logo-music-white.png";
import Link from "next/link";
import Search from "../../../public/images/search-gray.png";
import Mic from "../../../public/images/mic.png";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    User as User2,
    LogOut,
    ChevronDown,
    Bell,
    Camera,
    ChartColumnDecreasing,
} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import {useApp} from "@/app/Provider/AppContext";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "@/components/hooks/use-toast";
import {refreshAccessToken} from "@/app/Utils/FetchProtected";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type NavbarProps = {
    handleSearchQuery?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string | '';
    handleClickVoiceSearch?: () => void;
}

const Navbar = ({
                    handleSearchQuery,
                    value,
                    handleClickVoiceSearch
                }: NavbarProps) => {


    const router = useRouter();
    const path = usePathname();
    const [name, setName] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [file, setFile] = useState<File | undefined>(undefined);
    const [valueInput, setValueInput] = useState(value);
    const {user, logOut, setUser, isAdmin} = useApp();

    const handleSearch = () => {
        if (!(path === '/' || path.includes("?search="))) router.push("/");
    }


    const handleSubmit = () => {
        const formData = new FormData();
        const jsonData = {
            userId: user?.userId,
            userName: userName,
            name: name,
            email: user?.email
        }
        if (file) {
            formData.append("avatar", file);
        }
        formData.append("jsonData", JSON.stringify(jsonData));
        axios.put(`${process.env.NEXT_PUBLIC_API}/api/info`, formData).then(async function (response) {
            toast({
                description: response.data.message,
            })
            await refreshAccessToken();
            axios.get(`${process.env.NEXT_PUBLIC_API}/api/protected`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }).then(async function (response) {
                setUser(response.data.userInfo);
            }).catch(function (error) {
                console.log(error);
            })
        }).catch(function (err) {
            console.log(err);
        });
    }

    const handleChooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFile(file);
        const preview = document.getElementById('avatar') as HTMLImageElement;
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e?.target?.result as string;
        };
        reader.readAsDataURL(file!);
    }

    useEffect(() => {
        if (user) {
            const {name, userName} = user;
            setName(name);
            setUserName(userName);
        }
    }, [user]);

    useEffect(() => {
       setValueInput(value);
    }, [value]);

    return (
        <header
            className="flex bg-black py-3 px-12 justify-between items-center w-full sticky top-0 z-50">
            <Link href={"/public"}>
                <div className="basis-2/8 flex items-center gap-3">
                    <img
                        src={Logo.src}
                        width={60} height={60} alt={"logo"}/>
                    <h3 className="text-2xl text-[#b1b1b1] font-Jaro">SoundCloudNine</h3>
                </div>
            </Link>
            <div className="basis-4/8 relative w-max mr-[2%]">
                <img src={Search.src}
                     width="25" height="25" className="absolute left-2 top-[8px]" alt={""}/>
                <input
                    type={`search`} onInput={handleSearchQuery} onChange={(e) => setValueInput(e.target.value)} value={valueInput}
                    className="w-[700px] h-10 bg-transparent border-2 border-solid border-[#b1b1b1] rounded-full px-10 text-[#b1b1b1]"
                    placeholder="Tìm bài hát bạn yêu thích?" onFocus={handleSearch}/>
                <img src={Mic.src}
                     className="cursor-pointer hover:bg-gray-600 rounded-full absolute top-2 right-2" width="25" height="25" alt={""} onClick={handleClickVoiceSearch }/>
            </div>

            <div className="flex items-center">

                {!user ? (
                    <div
                        className="ml-24 w-10 h-10 shadow-2xl shadow-[#b1b1b1] bg-white rounded-md flex justify-center items-center cursor-pointer relative group">

                        <User2/>

                        <div
                            className="absolute w-max h-max bg-white top-14 gap-2 mr-[120px] rounded-lg p-[10px] transition-all ease-linear duration-100 hidden group-hover:block">
                            <div className="w-6 h-6 bg-transparent absolute right-[35px] -top-4">

                            </div>
                            <FontAwesomeIcon icon={faMapMarkerAlt}
                                             className="fas fa-map-marker text-white absolute -top-3 right-[40px] text-2xl rotate-180 group"/>

                            <Link href={'/login-register'}
                                  className="w-[180px] h-[30px] bg-slate-600 text-white flex justify-center items-center rounded-sm font-Roboto font-semibold m-2 text-sm hover:border-2 hover:border-solid hover:border-white no-underline">TÀI
                                KHOẢN</Link>
                        </div>
                    </div>

                ) : (
                    <>
                        <div
                            className="w-10 h-10 shadow-2xl shadow-[#b1b1b1] bg-white rounded-md flex justify-center items-center cursor-pointer mr-10">
                            {
                                isAdmin ? (
                                    <div className={`border-2 border-solid border-black rounded-[50%]`}>
                                        <Link href={"/dashboard/plays"}><ChartColumnDecreasing
                                            className={`text-black inline-block`}/></Link>
                                    </div>

                                ) : (
                                    <div className={`border-2 border-solid border-black rounded-[50%]`}>
                                        <Bell className={`text-black inline-block`}/>
                                    </div>
                                )
                            }
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="outline-none p-[1px] border-[3px] border-solid border-white outline-insert rounded-[50%] w-11 h-11 bg-transparent relative mr-5">
                                <img src={`${process.env.NEXT_PUBLIC_API}${user.avatar}`}
                                     className={`w-full h-full rounded-[50%]`} alt=""/>
                                <ChevronDown
                                    className={`text-white absolute right-0 bottom-[50%] translate-y-[50%] translate-x-7`}/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className={`!bg-white !text-black`}>
                                <Sheet>
                                    <SheetTrigger onClick={() => {
                                        const {name, userName} = user;
                                        setName(name);
                                        setUserName(userName);
                                    }}>
                                        <div
                                            className={`relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0  hover:bg-neutral-400`}>
                                            <User2 size={20}/><span
                                            className={`font-Roboto text-sm uppercase cursor-pointer`}>Tài khoản của tôi</span>
                                        </div>
                                    </SheetTrigger>
                                    <SheetContent className={`!bg-black`}>
                                        <SheetHeader>
                                            <SheetTitle className={`!text-white`}>Edit Profile</SheetTitle>
                                            <SheetDescription>
                                                Make changes to your profile here. Click save when you're done.
                                            </SheetDescription>
                                        </SheetHeader>
                                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                                            <div className={`flex items-center gap-4 py-4 px-4`}>
                                                <div
                                                    className={`relative w-20 h-20 border-2 border-solid border-white rounded-[50%]`}>
                                                    <img src={`${process.env.NEXT_PUBLIC_API}${user.avatar}`} width={70}
                                                         height={70} alt="img"
                                                         id={`avatar`}
                                                         className={`object-center object-cover rounded-[50%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`}/>
                                                    <input type={`file`} accept={`image/*`} onChange={handleChooseImage}
                                                           className={`absolute w-full h-full opacity-0 z-50`}/>
                                                    <Camera
                                                        className={`text-gray-800 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] opacity-80 -z-2`}/>
                                                </div>
                                                <Label className={`text-sm !text-white`}>Ảnh Đại Diện</Label>
                                            </div>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right !text-white">
                                                        Name
                                                    </Label>
                                                    <Input id="name" defaultValue={name}
                                                           onChange={(e) => setName(e.target.value)}
                                                           className="col-span-3 !text-white"/>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="username" className="text-right !text-white">
                                                        Username
                                                    </Label>
                                                    <Input id="username" defaultValue={userName}
                                                           onChange={(e) => setUserName(e.target.value)}
                                                           className="col-span-3 !text-white"/>
                                                </div>
                                            </div>
                                        </form>
                                        <SheetFooter>
                                            <SheetClose  asChild>
                                                <Button type="submit"
                                                        className={`!bg-white !text-black hover:bg-neutral-400`}
                                                        onClick={() => handleSubmit()}>Lưu</Button>
                                            </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                                <DropdownMenuSeparator className={`!bg-zinc-400`}/>
                                <AlertDialog>
                                    <AlertDialogTrigger className={`w-full`}>
                                        <div
                                            className={`relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0  hover:bg-neutral-400`}>
                                            <LogOut/><span
                                            className={`font-Roboto text-sm uppercase cursor-pointer`}>Đăng xuất</span>
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className={`!bg-black`}>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className={`!text-white`}>Bạn có chắc chắn muốn đăng
                                                xuất?</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className={`!text-white !bg-neutral-800`}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className={`!bg-white !text-black`} onClick={logOut}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}

            </div>

        </header>
    )
        ;
}

export default Navbar;