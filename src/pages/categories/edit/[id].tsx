import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { alias, instance, langOptions } from "@/utils"
import { useForm } from "@mantine/form"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { TextInput } from "../../../components/Text"
import { SegmentedControl } from "@mantine/core"

const EditCategory = () => {
    const form = useForm({
        initialValues: {
            name: "",
            nameJP: "",
            nameEN: ""
        }
    })
    const [lang, setLang] = useState<keyof typeof alias>("");
    const currentAlias = useMemo(() => alias[lang], [lang]);
    const [mounted, setMounted] = useState(false)

    let path: string
    useEffect(() => {
        path = window.location.pathname.split("/")[3]
        instance
            .get(`/categories/${path}`)
            .then((res) => {
                setMounted(true)
                form.setValues(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const [buttonLoading, setButtonLoading] = useState(false)
    const handleSaveCategory = useCallback(async () => {
        setButtonLoading(true)
        if (form.validate().hasErrors) {
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
            .patch(`/categories/${path}`, form.values)
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
        , [form])
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

                        <SegmentedControl data={langOptions} value={lang} onChange={setLang as any} />
                        <TextInput title={`Tên danh mục ${currentAlias}`} {...form.getInputProps(`name${lang}`)} />

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
