import { Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import type { Banner } from "@/types"
import { instance } from "@/utils"
import Link from "next/link"
import { useEffect, useState } from "react"
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import Swal from "sweetalert2"

const Banners = () => {
    const [data, setData] = useState<Banner[] | null>(null)
    useEffect(() => {
        instance.get(`/banners`).then((res) => {
            setData(res.data)
        })
    }, [])

    const deleteBanner = (id: number) => {
        instance
            .delete(`/banners/${id}`)
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
                deleteBanner(id)
                Swal.fire({
                    title: "Đã xóa!",
                    icon: "success",
                })
            }
        })
    }

    return (
        <MainLayout>
            <Breadcrumb pageName="Banner" link="">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href="/banners/create"
                >
                    Thêm banner
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
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Tên banner
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Ảnh
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
                                    data.map(({ id, name, image }) => (
                                        <tr key={id}>
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">
                                                    {name}
                                                </h5>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="font-medium text-black dark:text-white">
                                                    <img
                                                        src={image}
                                                        alt={name}
                                                        className="h-40 object-cover rounded-sm"
                                                    />
                                                </div>
                                            </td>

                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex items-center space-x-3.5">
                                                    <Link
                                                        href={`/banners/edit/${id}`}
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}
export default withAuth(Banners)
