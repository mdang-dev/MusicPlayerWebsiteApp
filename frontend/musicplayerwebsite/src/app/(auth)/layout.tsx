"use client"

import {ThemeProvider} from "@/components/ui/theme-provider";
import {ModeToggle} from "@/components/ui/toggle-dark-mode";
import React from "react";
import {Toaster} from "@/components/ui/toaster";
import VerifyProvider from "@/app/Provider/VerifyContext";
import {useApp} from "@/app/Provider/AppContext";
import {redirect} from "next/navigation";



const Layout = ({children}: { children: React.ReactNode }) => {

    const { user } = useApp();
    if(user) redirect("/");

    return (
        <VerifyProvider>
            <div>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className={`h-screen overflow-hidden`}>
                        <header className="flex mt-6 mr-[45px]">
                            <div className={`ml-auto`}>
                                <ModeToggle/>
                            </div>
                        </header>
                        <main className={`flex h-[83.5%] items-center justify-center`}>{children}</main>
                        <Toaster/>
                    </div>
                </ThemeProvider>
            </div>
        </VerifyProvider>
    )

}

export default Layout;