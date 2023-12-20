import { Button, Breadcrumb, ConfirmDelete } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import type { News } from "@/types";
import { instance } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    MdOutlineDelete,
    MdOutlineEdit,
    MdOutlineRemoveRedEye,
} from "react-icons/md";

const News = () => {
    const [data, setData] = useState<News[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        instance.get(`/news`).then((res) => {
            setData(res.data);
        });
    }, []);

    const handleDelete = (id: number) => {
        instance
            .delete(`/news/${id}`)
            .then(() => {
                const filteredTableData = data!.filter(
                    (item) => item.id !== id
                );
                setData(filteredTableData);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
    };

    return (
        <MainLayout>
            <Breadcrumb pageName="Bài viết" link="">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href="/news/create"
                >
                    Tạo mới
                </Button>
            </Breadcrumb>
            {!data ? (
                <TableSkeleton rows={5} columns={4} />
            ) : (
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        Tiêu đề
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Mô tả
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Danh mục
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white" />
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(
                                    ({ id, title, description, category }) => (
                                        <tr key={id}>
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">
                                                    {title}
                                                </h5>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {description}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {category.name}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex items-center space-x-3.5">
                                                    <Link
                                                        href={`/news/${id}`}
                                                        className="hover:text-primary"
                                                    >
                                                        <MdOutlineRemoveRedEye className="text-xl" />
                                                    </Link>
                                                    <Link
                                                        href={`/news/edit/${id}`}
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
export default withAuth(News);
