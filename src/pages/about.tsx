import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { convertBase64, instance } from "@/utils"
import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"

const About = () => {
    const [mounted, setMounted] = useState(false)
    const [ceoImage, setCeoImage] = useState("")
    const [quoteImage, setQuoteImage] = useState("")
    const [buttonLoading, setButtonLoading] = useState(false)

    const handleUploadCeoImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const file = e.target.files[0]
            const base64Image = await convertBase64(file)
            setCeoImage(base64Image)
        }
    }

    const handleUploadQuoteImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const file = e.target.files[0]
            const base64Image = await convertBase64(file)
            setQuoteImage(base64Image)
        }
    }

    useEffect(() => {
        instance
            .get("/metadata")
            .then((res) => {
                setCeoImage(res.data.ceoImage)
                setQuoteImage(res.data.quoteImage)
                setMounted(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const validateData = (): boolean => {
        if (ceoImage === "" || quoteImage === "") {
            return false
        }
        return true
    }

    const handleUpdateData = () => {
        setButtonLoading(true)
        if (!validateData()) {
            setButtonLoading(false)
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng điền đầy đủ thông tin!",
            })
            return
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
                })
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "Có lỗi xảy ra",
                })
            })
    }
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
    )
}

export default withAuth(About)
