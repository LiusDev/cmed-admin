import { Button, Breadcrumb } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import type { Partner } from "@/types";
import { instance } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    MdOutlineDelete,
    MdOutlineEdit,
    MdOutlineRemoveRedEye,
} from "react-icons/md";

const Users = () => {
    const [data, setData] = useState<Partner[] | null>(null);
    useEffect(() => {
        instance.get(`/users`).then((res) => {
            setData(res.data);
        });
    }, []);

    const handleDelete = (id: number) => {
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

    return (
        <MainLayout title="users">
            <Breadcrumb pageName="Users" link="">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href="/users/create"
                >
                    Create
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
                                        Name
                                    </th>
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        Image
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(({ id, name, image }) => (
                                    <tr key={id}>
                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {name}
                                            </h5>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <div className="font-medium text-black dark:text-white">
                                                <img
                                                    src={image}
                                                    alt="featured image"
                                                    className="h-40 object-cover rounded-sm"
                                                />
                                            </div>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};
export default withAuth(Users);
