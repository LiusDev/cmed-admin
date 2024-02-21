import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { instance } from "@/utils"
import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"

const EditCategory = () => {
    const [name, setName] = useState<string>("")
    const [mounted, setMounted] = useState(false)

    let path: string
    useEffect(() => {
        path = window.location.pathname.split("/")[3]
        instance
            .get(`/categories/${path}`)
            .then((res) => {
                setMounted(true)
                setName(res.data.name)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const validateData = (): boolean => {
        if (name.trim() === "") {
            return false
        }
        return true
    }
    const [buttonLoading, setButtonLoading] = useState(false)
    const handleSaveCategory = async () => {
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
        path = window.location.pathname.split("/")[3]
        await instance
            .patch(`/categories/${path}`, {
                name,
            })
            .then((res) => {
                if (res.status === 200) {
                    window.location.href = "/categories"
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
            .finally(() => {
                setButtonLoading(false)
            })
    }

    return (
        <MainLayout>
            <Breadcrumb pageName="Danh mục" link="/categories" />
            {!mounted ? (
                <TableSkeleton
                    rows={3}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white capitalize">
                            Sửa danh mục
                        </h3>
                    </div>

                    <div className="flex flex-col gap-5.5 p-6.5">
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Tên danh mục
                            </label>
                            <input
                                value={name}
                                onChange={handleChangeName}
                                type="text"
                                placeholder="Tên danh mục"
                                name="categoryName"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <Button
                                onClick={handleSaveCategory}
                                color="success"
                                variant="rounded"
                                isLoading={buttonLoading}
                                className="w-full"
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    )
}

export default withAuth(EditCategory)
