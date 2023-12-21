import React, { createContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./header";
import Head from "next/head";
import { User } from "@/types";
import { instance } from "@/utils";

const MainLayout = ({
    title,
    description,
    children,
}: {
    title?: string;
    description?: string;
    children?: React.ReactNode;
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <Head>
                <title>
                    {title ? `${title} | CMED Admin Panel` : "CMED Admin Panel"}
                </title>
                <meta
                    name="description"
                    content={
                        description
                            ? description
                            : "CMED Admin Panel for managing the website"
                    }
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex h-screen overflow-hidden">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default MainLayout;
