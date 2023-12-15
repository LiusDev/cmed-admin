import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
    MdArrowBack,
    MdCalendarMonth,
    MdNewspaper,
    MdPersonOutline,
} from "react-icons/md";

interface MenuItemProps {
    label: string;
    icon: React.ReactNode;
    link: string;
}

interface MenuSectionProps {
    title: string;
    items: MenuItemProps[];
}

const menuItems = [
    {
        title: "Manage",
        items: [
            {
                label: "News",
                icon: <MdNewspaper className="text-2xl" />,
                link: "/news",
            },
        ],
    },
];

const MenuItem = ({ label, icon, link }: MenuItemProps) => {
    const pathname = useRouter().pathname;

    return (
        <li>
            <Link
                href={link}
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes(link) && "bg-graydark dark:bg-meta-4"
                }`}
            >
                {icon}
                {label}
            </Link>
        </li>
    );
};

const MenuSection = ({ title, items }: MenuSectionProps) => {
    return (
        <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 uppercase">
                {title}
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
                {items.map((item) => (
                    <MenuItem
                        key={item.link}
                        label={item.label}
                        icon={item.icon}
                        link={item.link}
                    />
                ))}
            </ul>
        </div>
    );
};

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const closeSidebarButtonRef = useRef<HTMLButtonElement>(null);

    // Handle closing sidebar when clicking outside of it
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target as Node) &&
                !closeSidebarButtonRef.current?.contains(e.target as Node)
            ) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <aside
            ref={sidebarRef}
            className={` absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } `}
        >
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                <Link href="/">
                    <Image
                        width={176}
                        height={32}
                        src={"/images/logo/logo.svg"}
                        alt="Logo"
                    />
                </Link>
                <button
                    ref={closeSidebarButtonRef}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    className="block lg:hidden"
                >
                    <MdArrowBack className="text-3xl" />
                </button>
            </div>

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    {menuItems.map((item) => (
                        <MenuSection
                            key={item.title}
                            title={item.title}
                            items={item.items}
                        />
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
