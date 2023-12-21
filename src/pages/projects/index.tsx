import { Button, Breadcrumb, ConfirmDelete } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import type { Project } from "@/types";
import { convertDate, instance } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    MdOutlineDelete,
    MdOutlineEdit,
    MdOutlineRemoveRedEye,
} from "react-icons/md";

const PAGE_SIZE = 500;

const Projects = () => {
    const [data, setData] = useState<Project[] | null>(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        instance.get(`/projects?perPage=${PAGE_SIZE}`).then((res) => {
            setData(res.data);
        });
    }, []);

    const handleDelete = (id: number) => {
        instance
            .delete(`/projects/${id}`)
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

    const [searchName, setSearchName] = useState("");
    const [searchDescription, setSearchDescription] = useState("");

    const handleSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value);
    };

    const handleSearchDescription = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchDescription(e.target.value);
    };

    const [searchLoading, setSearchLoading] = useState(false);
    const handleSearch = () => {
        setSearchLoading(true);

        instance
            .get(
                `/news?name=${searchName}&description=${searchDescription}&perPage=${PAGE_SIZE}`
            )
            .then((res) => {
                setData(res.data);
                setSearchLoading(false);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
    };

    return (
        <MainLayout>
            <Breadcrumb pageName="Dự án" link="">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href="/projects/create"
                >
                    Thêm mới
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
                                        <input
                                            value={searchName}
                                            onChange={handleSearchName}
                                            type="text"
                                            placeholder="Tên"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        <input
                                            value={searchDescription}
                                            onChange={handleSearchDescription}
                                            type="text"
                                            placeholder="Mô tả"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Ảnh nổi bật
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Ngày tạo
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Ngày chỉnh sửa
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        <Button
                                            size="small"
                                            variant="rounded"
                                            onClick={handleSearch}
                                            isLoading={searchLoading}
                                            className="w-36"
                                        >
                                            Tìm kiếm
                                        </Button>
                                    </th>
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
                                        ({
                                            id,
                                            name,
                                            description,
                                            featuredImage,
                                            createdAt,
                                            modifiedAt,
                                        }) => (
                                            <tr key={id}>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    <h5 className="font-medium text-black dark:text-white">
                                                        {name}
                                                    </h5>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">
                                                        {description}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <div className="font-medium text-black dark:text-white">
                                                        <img
                                                            src={featuredImage}
                                                            alt="featured image"
                                                            className="h-40 object-cover rounded-sm"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">
                                                        {convertDate(createdAt)}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">
                                                        {convertDate(
                                                            modifiedAt
                                                        )}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <div className="flex items-center space-x-3.5">
                                                        <Link
                                                            href={`/projects/${id}`}
                                                            className="hover:text-primary"
                                                        >
                                                            <MdOutlineRemoveRedEye className="text-xl" />
                                                        </Link>
                                                        <Link
                                                            href={`/projects/edit/${id}`}
                                                            className="hover:text-success"
                                                        >
                                                            <MdOutlineEdit className="text-xl" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                setShowModal(
                                                                    true
                                                                )
                                                            }
                                                            className="hover:text-danger"
                                                        >
                                                            <MdOutlineDelete className="text-xl" />
                                                        </button>
                                                        <ConfirmDelete
                                                            title="Bạn có chắc chắn muốn xóa?"
                                                            description="Hành động này không thể hoàn tác."
                                                            show={showModal}
                                                            setShow={
                                                                setShowModal
                                                            }
                                                            handleDelete={() =>
                                                                handleDelete(id)
                                                            }
                                                        />
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
    );
};
export default withAuth(Projects);
