import { Box, Button, Breadcrumb } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import { instance } from "@/utils";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FroalaEditorComponent = dynamic(
    () => import("@/components/customEditor"),
    {
        ssr: false,
    }
);

const Create = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleChangeDescription = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescription(e.target.value);
    };

    const router = useRouter();
    const handlePublish = async () => {
        setLoading(true);
        instance
            .post("/projects", {
                name,
                description,
                content,
            })
            .then(() => {
                router.push("/projects");
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
            <Breadcrumb pageName="Projects" link="/projects" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Create Projects
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Project name
                        </label>
                        <input
                            value={name}
                            onChange={handleChangeName}
                            type="text"
                            placeholder="Project name"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Description
                        </label>
                        <input
                            value={description}
                            onChange={handleChangeDescription}
                            type="text"
                            placeholder="Project description"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Content
                        </label>
                        <FroalaEditorComponent setModel={setContent} />
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
        </MainLayout>
    );
};

export default withAuth(Create);
