import { Breadcrumb, Button, ConfirmDelete } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import { Category } from "@/types";
import { convertDate, instance } from "@/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

const Categories = () => {
    const [categoriesData, setCategoriesData] = useState<Category[] | null>(
        null
    );
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        instance.get(`/categories`).then((res) => {
            setCategoriesData(res.data);
        });
    }, []);

    const handleDelete = async (id: number) => {
        await instance
            .delete(`/categories/${id}`)
            .then(() => {
                const newCategories = categoriesData!.filter(
                    (category) => category.id !== id
                );
                setCategoriesData(newCategories);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
    };

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
                                {categoriesData.map(
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
                                                            setShowModal(true)
                                                        }
                                                        className="hover:text-danger"
                                                    >
                                                        <MdOutlineDelete className="text-xl" />
                                                    </button>
                                                    <ConfirmDelete
                                                        title="Bạn có chắc chắn muốn xóa?"
                                                        description="Hành động này không thể hoàn tác."
                                                        show={showModal}
                                                        setShow={setShowModal}
                                                        handleDelete={() =>
                                                            handleDelete(id)
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default withAuth(Categories);
