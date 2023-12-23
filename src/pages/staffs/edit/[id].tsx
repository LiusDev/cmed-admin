import { Box, Breadcrumb, Button } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import type { Staff } from "@/types";
import { convertBase64, instance } from "@/utils";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Edit = () => {
    const [staff, setStaff] = useState<Staff | null>(null);

    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [featuredImage, setFeaturedImage] = useState("");
    const [loading, setLoading] = useState(false);

    let path: string;
    useEffect(() => {
        path = window.location.pathname.split("/")[3];
        instance
            .get(`/staffs/${path}`)
            .then((res) => {
                setStaff(res.data);
                setName(res.data.name);
                setPosition(res.data.position);
                setFeaturedImage(res.data.featuredImage);
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

    const handleChangePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPosition(e.target.value);
    };

    const handleUploadFeaturedImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const base64Image = await convertBase64(file);
            setFeaturedImage(base64Image);
        }
    };

    const validateData = (): boolean => {
        if (name.trim() === "" || position.trim() === "") {
            return false;
        }
        return true;
    };

    const handlePublish = async () => {
        setLoading(true);
        if (!validateData()) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng điền đầy đủ thông tin!",
            });
            return;
        }
        const body = {
            name,
            position,
            featuredImage,
        };

        if (staff) {
            await instance
                .patch(`/staffs/${staff.id}`, body)
                .then(() => {
                    window.location.href = "/staffs";
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        window.location.href = "/signin";
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <Breadcrumb pageName="Nhân viên" link="/staffs" />
            {!staff ? (
                <TableSkeleton
                    rows={4}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Cập nhật nhân viên
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
                                placeholder="Tên nhân viên"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Vị trí
                            </label>
                            <input
                                value={position}
                                onChange={handleChangePosition}
                                type="text"
                                placeholder="Vị trí hiện tại"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Ảnh nổi bật
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadFeaturedImage}
                                className="mb-3 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                            />
                            {featuredImage && (
                                <img
                                    src={featuredImage}
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
                                isLoading={loading}
                                className="w-full"
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    );
};

export default withAuth(Edit);
