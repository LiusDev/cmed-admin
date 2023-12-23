import { Box, Breadcrumb, Button } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import { instance } from "@/utils";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Metadata = () => {
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    useEffect(() => {
        instance
            .get("/metadata")
            .then((res) => {
                setName(res.data.companyName);
                setPhone(res.data.companyPhone);
                setEmail(res.data.companyEmail);
                setAddress(res.data.companyAddress);
                setMounted(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const validateData = (): boolean => {
        if (
            name.trim() === "" ||
            phone.trim() === "" ||
            email.trim() === "" ||
            address.trim() === ""
        ) {
            return false;
        }
        return true;
    };

    const handleUpdateData = () => {
        setButtonLoading(true);
        if (!validateData()) {
            setButtonLoading(false);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng điền đầy đủ thông tin!",
            });
            return;
        }
        instance
            .patch("/metadata", {
                companyName: name,
                companyPhone: phone,
                companyEmail: email,
                companyAddress: address,
            })
            .then((res) => {
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật thành công",
                });
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "Có lỗi xảy ra",
                });
            });
    };
    return (
        <MainLayout>
            <Breadcrumb pageName="Thông tin công ty" link="/metadata" />
            {!mounted ? (
                <TableSkeleton
                    rows={5}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white capitalize">
                            Thông tin công ty
                        </h3>
                    </div>

                    <div className="flex flex-col gap-5.5 p-6.5">
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Tên công ty
                            </label>
                            <input
                                value={name}
                                onChange={handleChangeName}
                                type="text"
                                placeholder="Tên công ty"
                                name="categoryName"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Số điện thoại
                            </label>
                            <input
                                value={phone}
                                onChange={handleChangePhone}
                                type="text"
                                placeholder="Số điện thoại"
                                name="categoryName"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Email
                            </label>
                            <input
                                value={email}
                                onChange={handleChangeEmail}
                                type="text"
                                placeholder="Email"
                                name="categoryName"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Địa chỉ
                            </label>
                            <input
                                value={address}
                                onChange={handleChangeAddress}
                                type="text"
                                placeholder="Địa chỉ"
                                name="categoryName"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <Button
                                onClick={handleUpdateData}
                                color="success"
                                variant="rounded"
                                className="w-full"
                                isLoading={buttonLoading}
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    );
};

export default withAuth(Metadata);
