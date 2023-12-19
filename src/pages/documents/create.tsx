import { Box, Button, Breadcrumb } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import { Category } from "@/types";
import { convertBase64, instance } from "@/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Create = () => {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [name, setName] = useState("");
    const [category, setCategory] = useState<Category["id"]>(1);
    const [description, setDescription] = useState("");
    const [documentUrl, setDocumentUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        instance
            .get(`/categories`)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
    }, []);

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(parseInt(e.target.value));
    };

    const handleChangeDescription = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescription(e.target.value);
    };

    const handleChangeDocumentUrl = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDocumentUrl(e.target.value);
    };
    const router = useRouter();

    const handlePublish = async () => {
        setLoading(true);
        instance
            .post("/documents", {
                name,
                description,
                documentUrl,
                categoryId: category,
            })
            .then(() => {
                router.push("/documents");
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    router.push("/signin");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <MainLayout>
            <Breadcrumb pageName="Documents" link="/documents" />
            {!categories ? (
                <TableSkeleton
                    rows={4}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Create Documents
                        </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Name
                                </label>
                                <input
                                    value={name}
                                    onChange={handleChangeName}
                                    type="text"
                                    placeholder="Document name"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Category
                                </label>
                                <select
                                    onChange={handleChangeCategory}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Description
                            </label>
                            <input
                                value={description}
                                onChange={handleChangeDescription}
                                type="text"
                                placeholder="Document description"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Document URL
                            </label>
                            <input
                                value={documentUrl}
                                onChange={handleChangeDocumentUrl}
                                type="text"
                                placeholder="Document URL"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <Button
                                onClick={handlePublish}
                                color="success"
                                variant="rounded"
                                className="w-full"
                                isLoading={loading}
                            >
                                Publish
                            </Button>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    );
};

export default withAuth(Create);
