import { Box, Breadcrumb, Button } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import { Category } from "@/types";
import { instance } from "@/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

const Categories = () => {
    const [categoriesData, setCategoriesData] = useState<Category[] | null>(
        null
    );

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
            <Breadcrumb pageName="Categories" link="">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href="/categories/create"
                >
                    Create
                </Button>
            </Breadcrumb>
            {!categoriesData ? (
                <TableSkeleton
                    rows={4}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            All categories
                        </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                        {categoriesData.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between"
                            >
                                <div className="flex gap-2">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {category.name}
                                    </h5>
                                    <span>{` (${category.news.length} news, ${category.documents.length} documents) `}</span>
                                </div>

                                <div className="flex items-center space-x-3.5">
                                    <Link
                                        href={`/categories/edit/${category.id}`}
                                        className="hover:text-success"
                                    >
                                        <MdOutlineEdit className="text-xl" />
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(category.id)
                                        }
                                        className="hover:text-danger"
                                    >
                                        <MdOutlineDelete className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Box>
            )}
        </MainLayout>
    );
};

export default withAuth(Categories);
