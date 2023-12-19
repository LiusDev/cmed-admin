import { Button, Breadcrumb } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import type { Project } from "@/types";
import { instance } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    MdOutlineDelete,
    MdOutlineEdit,
    MdOutlineRemoveRedEye,
} from "react-icons/md";

const Projects = () => {
    const [data, setData] = useState<Project[] | null>(null);
    useEffect(() => {
        instance.get(`/projects`).then((res) => {
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

    return (
        <MainLayout title="Projects">
            <Breadcrumb pageName="Projects" link="">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href="/projects/create"
                >
                    Create
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
                                        Name
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Description
                                    </th>

                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(({ id, name, description }) => (
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
export default withAuth(Projects);
