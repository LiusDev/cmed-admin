import { Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { Category } from "@/types"
import { convertDate, instance } from "@/utils"
import { HttpStatusCode } from "axios"
import Link from "next/link"
import React, { useCallback, useEffect, useState } from "react"
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import Swal from "sweetalert2"

const PAGE_SIZE = 500

const Categories = () => {
    const [categoriesData, setCategoriesData] = useState<Category[] | null>(
        null
    )

    useEffect(() => {
        instance
            .get(`/categories?perPage=${PAGE_SIZE}&order=desc`)
            .then((res) => {
                setCategoriesData(res.data)
            })
    }, [])

    const deleteCategory = useCallback((id: number, done?: Function, deny?: Function, error?: Function) => {
        instance
            .delete(`/categories/${id}`)
            .then((res) => {
                switch (res.status) {
                    case HttpStatusCode.NoContent:
                        setCategoriesData(r => r!.filter(
                            (category) => category.id !== id
                        ))
                        done?.()
                        break
                    case HttpStatusCode.UnprocessableEntity:
                        deny?.()
                        break
                }
            })
            .catch((err) => {
                switch (err.response.status) {
                    case HttpStatusCode.UnprocessableEntity:
                        deny?.()
                        break
                    case HttpStatusCode.Unauthorized:
                        window.location.href = "/signin"
                        break
                    default:
                        error?.()
                }

            })
    }, [instance])

    const handleDelete = useCallback((id: number) => {
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
                deleteCategory(id, () => {
                    Swal.fire({
                        title: "Đã xóa!",
                        icon: "success",
                    })
                }, () => {
                    Swal.fire({
                        title: "Không xoá được",
                        icon: "warning",
                    })
                }, () => {
                    Swal.fire({
                        title: "Lỗi máy chủ",
                        icon: "error",
                    })
                })

            }
        })
    }, [deleteCategory])

    return (
        <MainLayout>
            <Breadcrumb pageName="Danh mục" link="">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href="/categories/create"
                >
                    Thêm mới
                </Button>
            </Breadcrumb>
            {!categoriesData ? (
                <TableSkeleton rows={5} columns={6} />
            ) : (
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        Tên danh mục
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                        Số lượng bài viết
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                        Số lượng tài liệu
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                        Ngày tạo
                                    </th>

                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriesData.length === 0 ? (
                                    <tr>
                                        <td colSpan={10}>
                                            <div className="text-black/70 dark:text-white/70 w-full flex items-center justify-center h-20 font-medium">
                                                Không có dữ liệu
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    categoriesData.map(
                                        ({
                                            id,
                                            name,
                                            news,
                                            documents,
                                            createdAt,
                                        }) => (
                                            <tr key={id}>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    <h5 className="font-medium text-black dark:text-white">
                                                        {name}
                                                    </h5>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                                                    <p className="text-black dark:text-white">
                                                        {news.length}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                                                    <p className="text-black dark:text-white">
                                                        {documents.length}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                                                    <p className="text-black dark:text-white">
                                                        {convertDate(createdAt)}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <div className="flex items-center space-x-3.5">
                                                        <Link
                                                            href={`/categories/edit/${id}`}
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

export default withAuth(Categories)
