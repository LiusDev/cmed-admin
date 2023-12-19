import { Box, Breadcrumb, Button } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import { instance } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Create = () => {
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const router = useRouter();
    const handleCreateCategory = async () => {
        setButtonLoading(true);
        await instance
            .post("/categories", {
                name,
            })
            .then((res) => {
                if (res.status === 201) {
                    router.push("/categories");
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    router.push("/signin");
                }
            })
            .finally(() => {
                setButtonLoading(false);
            });
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <MainLayout>
            <Breadcrumb pageName="Categories" link="/categories" />
            {!mounted ? (
                <TableSkeleton
                    rows={3}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Create category
                        </h3>
                    </div>

                    <div className="flex flex-col gap-5.5 p-6.5">
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Name
                            </label>
                            <input
                                value={name}
                                onChange={handleChangeName}
                                type="text"
                                placeholder="Category name"
                                name="categoryName"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>

                        <div>
                            <Button
                                onClick={handleCreateCategory}
                                color="success"
                                variant="rounded"
                                className="w-full"
                                isLoading={buttonLoading}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    );
};

export default withAuth(Create);
