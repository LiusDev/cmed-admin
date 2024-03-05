import { Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import type { AboutSlide, Partner } from "@/types"
import { convertDate, instance } from "@/utils"
import Link from "next/link"
import { useEffect, useState } from "react"
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import Swal from "sweetalert2"

const PAGE_SIZE = 500

const About = () => {
    const [data, setData] = useState<AboutSlide[] | null>(null)
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        instance.get(`/about-slides`).then((res) => {
            setData(res.data)
        })
    }, [])

    const deleteSlide = (id: number) => {
        instance
            .delete(`/about-slides/${id}`)
            .then(() => {
                const filteredTableData = data!.filter((item) => item.id !== id)
                setData(filteredTableData)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Bạn có chắc chắn muốn xóa?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Chắc chắn!",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSlide(id)
                Swal.fire({
                    title: "Đã xóa!",
                    icon: "success",
                })
            }
        })
    }

    return (
        <MainLayout>
            <Breadcrumb pageName="Slide về chúng tôi" link="">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href="/about/create"
                >
                    Thêm mới
                </Button>
            </Breadcrumb>
            {!data ? (
                <TableSkeleton rows={5} columns={3} />
            ) : (
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        Tiêu đề
                                    </th>
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        Mô tả
                                    </th>
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        Ảnh nổi bật
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={10}>
                                            <div className="text-black/70 dark:text-white/70 w-full flex items-center justify-center h-20 font-medium">
                                                Không có dữ liệu
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map(
                                        ({ id, title, description, image }) => (
                                            <tr key={id}>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    <h5 className="font-medium text-black dark:text-white">
                                                        {title}
                                                    </h5>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark max-w-34">
                                                    <p className="text-black dark:text-white line-clamp-4">
                                                        {description}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    <div className="font-medium text-black dark:text-white">
                                                        <img
                                                            src={image}
                                                            alt="featured image"
                                                            className="h-40 w-full object-cover object-center rounded-sm"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <div className="flex items-center space-x-3.5">
                                                        <Link
                                                            href={`/about/edit/${id}`}
                                                            className="hover:text-success"
                                                        >
                                                            <MdOutlineEdit className="text-xl" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(id)
                                                            }
                                                            className="hover:text-danger"
                                                        >
                                                            <MdOutlineDelete className="text-xl" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}
export default withAuth(About)
