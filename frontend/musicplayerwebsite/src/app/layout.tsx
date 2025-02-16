"use client"
import "./globals.css";
import React from "react";
import { usePathname } from "next/navigation";
import AudioProvider from "@/app/Provider/AudioContext";
import AppProvider from "@/app/Provider/AppContext";
import "regenerator-runtime/runtime";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const pathName = usePathname();
   const style:object = pathName === "/" ? {
       colorScheme: "light",
   } : {}

  return (
    <html lang="en"  suppressHydrationWarning style={style}>
      <body
      >
     <AppProvider>
         <AudioProvider>
             <main>{children}</main>
         </AudioProvider>
     </AppProvider>
      </body>
    </html>
  );
}
