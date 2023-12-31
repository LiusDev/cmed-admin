import { Button, Breadcrumb } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import { UserRole, type User, roleLabels } from "@/types";
import { instance } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import Swal from "sweetalert2";

const PAGE_SiZE = 500;

const Users = () => {
    const [data, setData] = useState<User[] | null>(null);

    useEffect(() => {
        instance.get(`/users?perPage=${PAGE_SiZE}&order=desc`).then((res) => {
            setData(res.data);
        });
    }, []);

    const deleteUser = (id: number) => {
        instance
            .delete(`/users/${id}`)
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
                if (err.response.status === 403) {
                    window.location.href = "/";
                }
            });
    };

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
                deleteUser(id);
                Swal.fire({
                    title: "Đã xóa!",
                    icon: "success",
                });
            }
        });
    };

    return (
        <MainLayout>
            <Breadcrumb pageName="Tài khoản" link="">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href="/users/create"
                >
                    Tạo tài khoản
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
                                        Tên
                                    </th>
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                                        Tên đăng nhập
                                    </th>
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                                        Quyền hạn
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white" />
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
                                    data.map(({ id, name, role, username }) => (
                                        <tr key={id}>
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">
                                                    {name}
                                                </h5>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {username}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {roleLabels[role]}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                {role !== UserRole.ADMIN && (
                                                    <div className="flex items-center space-x-3.5">
                                                        <Link
                                                            href={`/users/edit/${id}`}
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
                                                )}
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
    );
};
export default withAuth(Users);
