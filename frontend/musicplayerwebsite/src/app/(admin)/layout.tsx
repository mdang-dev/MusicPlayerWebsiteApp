"use client"

import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {Separator} from "@/components/ui/separator";
import {ThemeProvider} from "@/components/ui/theme-provider";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React, {Fragment, useEffect, useRef, useState} from "react";

import Link from "next/link";
import {redirect, usePathname} from "next/navigation";
import {ModeToggle} from "@/components/ui/toggle-dark-mode";
import {Toaster} from "@/components/ui/toaster";
import {useApp} from "@/app/Provider/AppContext";

type propsPage = {
    url?: string;
    page?: string;
    option?: string;
}

const Layout = ({children}: { children: React.ReactNode }) => {

    const { isAdmin } = useApp();

    if(!isAdmin) redirect("/");

    const getPage = (url: string): propsPage => {
        if (url === '/songs-management/list') return {url: url, page: 'Bài Hát', option: 'Danh Sách'}
        if (url === '/songs-management/form') return {url: url, page: 'Bài Hát', option: 'Thêm Mới'}
        if (url.includes('/songs-management/form')) return {url: url, page: 'Bài Hát', option: 'Cập Nhật'}
        if (url === '/users-management/list') return {url: url, page: 'Người Dùng', option: 'Danh Sách'}
        if (url === '/artists-management/list') return {url: url, page: 'Nghệ Sĩ', option: 'Danh Sách'}
        if (url === '/genres-management/list') return {url: url, page: 'Thể Loại', option: 'Danh Sách'}
        if (url === '/artists-management/form') return {url: url, page: 'Nghệ Sĩ', option: 'Thêm Mới'}
        if (url.includes('/artists-management/form')) return {url: url, page:'Nghệ Sĩ', option: 'Cập Nhật'}
        if (url == '/genres-management/form') return {url: url, page:'Thể Loại', option: 'Thêm Mới'}
        if (url.includes('/genres-management/form')) return {url: url, page:'Thể Loại', option: 'Cập Nhật'}
        if (url === '/admin-management/form') return {url: url, page: 'Tài Khoản Quản Trị', option: 'Thêm Mới'}
        if (url.includes('/admin-management/form')) return {url: url, page: 'Tài Khoản Quản Trị', option: 'Cập Nhật'}
        if (url === '/admin-management/list') return {url: url, page: 'Tài Khoản Quản Trị', option: 'Danh Sách'}
        if (url === '/dashboard/plays') return {url: url, page: 'Thống Kê', option: 'Lượt Nghe'}
        if (url === '/dashboard/liked-count') return {url: url, page: 'Thống Kê', option: 'Lượt Yêu Thích'}
        return {}
    }

    const pathname = usePathname();
    const url = useRef<string>(`${pathname}`);
    const [page, setPage] = useState<propsPage>(getPage(url.current));
    useEffect(() => {
        url.current = `${pathname}`;
        setPage(getPage(url.current));
    }, [pathname]);


    return (
        <div>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <div className={`h-screen overflow-hidden`}>
                    <SidebarProvider>
                        <AppSidebar/>
                        <SidebarInset>
                            <header className="flex h-16 shrink-0 items-center gap-2 mr-[45px]">
                                <div className="flex items-center gap-2 px-4">
                                    <SidebarTrigger className="-ml-1"/>
                                    <Separator orientation="vertical" className="mr-2 h-4"/>
                                    <Breadcrumb>
                                        <BreadcrumbList>
                                            <BreadcrumbItem className="hidden md:block">
                                                <Link href={page.url!}>
                                                    {page.page}
                                                </Link>
                                            </BreadcrumbItem>
                                            {page.option ? (
                                                <Fragment>
                                                    <BreadcrumbSeparator className="hidden md:block"/>
                                                    <BreadcrumbItem>
                                                        <BreadcrumbPage>{page.option}</BreadcrumbPage>
                                                    </BreadcrumbItem>
                                                </Fragment>) : null}
                                        </BreadcrumbList>
                                    </Breadcrumb>
                                </div>
                                <div className={`ml-auto`}>
                                    <ModeToggle/>
                                </div>
                            </header>

                            <main>{children}</main>
                            <Toaster/>
                            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                                    <div className="aspect-video rounded-xl bg-muted/50"/>
                                    <div className="aspect-video rounded-xl bg-muted/50"/>
                                    <div className="aspect-video rounded-xl bg-muted/50"/>
                                </div>
                                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                </div>
            </ThemeProvider>
        </div>
    )

}

export default Layout;