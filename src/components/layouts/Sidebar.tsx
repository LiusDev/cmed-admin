import { User, UserRole } from "@/types"
import { getUserData } from "@/utils"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import {
    MdAccountCircle,
    MdArrowBack,
    MdImage,
    MdInfoOutline,
    MdLightbulbOutline,
    MdMenuOpen,
    MdMiscellaneousServices,
    MdNewspaper,
    MdOutlineContactMail,
    MdOutlineDocumentScanner,
    MdOutlineHandshake,
    MdOutlinePages,
    MdOutlinePersonAddAlt,
    MdPages,
    MdPersonOutline,
    MdWorkOutline,
} from "react-icons/md"

interface MenuItemProps {
    label: string
    icon: React.ReactNode
    link: string
    roles: UserRole[]
}

interface MenuSectionProps {
    title: string
    items: MenuItemProps[]
}

const menuItems = [
    {
        title: "Quản lý",
        items: [
            // {
            //     label: "Slide về chúng tôi",
            //     icon: <MdImage className="text-2xl" />,
            //     link: "/about",
            //     roles: [UserRole.ADMIN, UserRole.STAFF],
            // },
            {
                label: "Banner",
                icon: <MdImage className="text-2xl" />,
                link: "/banners",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Danh Mục",
                icon: <MdMenuOpen className="text-2xl" />,
                link: "/categories",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Bài viết",
                icon: <MdNewspaper className="text-2xl" />,
                link: "/news",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Tài liệu",
                icon: <MdOutlineDocumentScanner className="text-2xl" />,
                link: "/documents",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Đối tác",
                icon: <MdOutlineHandshake className="text-2xl" />,
                link: "/partners",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Khách hàng",
                icon: <MdOutlinePersonAddAlt className="text-2xl" />,
                link: "/customers",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Dự án",
                icon: <MdLightbulbOutline className="text-2xl" />,
                link: "/projects",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Dịch vụ trang chủ",
                icon: <MdMiscellaneousServices className="text-2xl" />,
                link: "/homepage-services",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Dịch vụ",
                icon: <MdMiscellaneousServices className="text-2xl" />,
                link: "/services",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Nhân viên",
                icon: <MdPersonOutline className="text-2xl" />,
                link: "/staffs",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Thông tin công ty",
                icon: <MdInfoOutline className="text-2xl" />,
                link: "/metadata",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Liên hệ",
                icon: <MdOutlineContactMail className="text-2xl" />,
                link: "/contacts",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Tuyển dụng",
                icon: <MdWorkOutline className="text-2xl" />,
                link: "/recruitment",
                roles: [UserRole.ADMIN, UserRole.STAFF],
            },
            {
                label: "Quản lý tài khoản",
                icon: <MdAccountCircle className="text-2xl" />,
                link: "/users",
                roles: [UserRole.ADMIN],
            },
            {
                label: "Trang \"Về chúng tôi\"",
                icon: <MdOutlinePages className="text-2xl" />,
                link: "/setting/about-page",
                roles: [UserRole.ADMIN],
            },
        ],
    },
]

const MenuItem = ({ label, icon, link }: Omit<MenuItemProps, "roles">) => {
    const pathname = useRouter().pathname

    return (
        <li>
            <Link
                href={link}
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 capitalize duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes(link) && "bg-graydark dark:bg-meta-4"
                }`}
            >
                {icon}
                {label}
            </Link>
        </li>
    )
}

const MenuSection = ({ title, items }: MenuSectionProps) => {
    const [userData, setUserData] = useState<User | null>(null)
    useEffect(() => {
        setUserData(getUserData())
    }, [])

    return (
        userData && (
            <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 uppercase">
                    {title}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                    {items.map(
                        (item) =>
                            item.roles.includes(userData!.role) && (
                                <MenuItem
                                    key={item.link}
                                    label={item.label}
                                    icon={item.icon}
                                    link={item.link}
                                />
                            )
                    )}
                </ul>
            </div>
        )
    )
}

const Sidebar = ({
    sidebarOpen,
    setSidebarOpen,
}: {
    sidebarOpen: boolean
    setSidebarOpen: (arg: boolean) => void
}) => {
    const sidebarRef = useRef<HTMLDivElement>(null)
    const closeSidebarButtonRef = useRef<HTMLButtonElement>(null)

    // Handle closing sidebar when clicking outside of it
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target as Node) &&
                !closeSidebarButtonRef.current?.contains(e.target as Node)
            ) {
                setSidebarOpen(false)
            }
        }

        document.addEventListener("click", handleOutsideClick)

        return () => {
            document.removeEventListener("click", handleOutsideClick)
        }
    }, [])

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
                        width={120}
                        height={32}
                        src={"/images/logo/logo.png"}
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
    )
}

export default Sidebar
