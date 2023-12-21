import { Box, Button, Breadcrumb, NotiModal } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import withAuth from "@/hoc/withAuth";
import {} from "@/types";
import { convertBase64, instance } from "@/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Create = () => {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleUploadImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const base64Image = await convertBase64(file);
            setImage(base64Image);
        }
    };
    const validateData = (): boolean => {
        if (name.trim() === "" || image === "") {
            return false;
        }
        return true;
    };
    const router = useRouter();

    const handlePublish = async () => {
        setLoading(true);
        if (!validateData()) {
            setLoading(false);
            setIsModalOpen(true);
            return;
        }
        instance
            .post("/partners", {
                name,
                image,
            })
            .then(() => {
                router.push("/partners");
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
            <Breadcrumb pageName="Đối tác" link="/partners" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Thêm đối tác mới
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Tên
                        </label>
                        <input
                            value={name}
                            onChange={handleChangeName}
                            type="text"
                            placeholder="Tên đối tác"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Logo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadImage}
                            className="mb-3 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        />
                        {image && (
                            <img
                                src={image}
                                alt="featured image"
                                className="h-40 object-cover rounded-sm"
                            />
                        )}
                    </div>
                    <div>
                        <Button
                            onClick={handlePublish}
                            color="success"
                            variant="rounded"
                            className="w-full"
                            isLoading={loading}
                        >
                            Thêm mới
                        </Button>
                        <NotiModal
                            show={isModalOpen}
                            setShow={setIsModalOpen}
                            title="Lỗi"
                            description="Vui lòng nhập đầy đủ thông tin"
                            type="error"
                        />
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
};

export default withAuth(Create);
