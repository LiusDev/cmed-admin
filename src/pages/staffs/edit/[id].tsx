import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import type { Staff } from "@/types"
import { alias, convertBase64, instance, langOptions } from "@/utils"
import { useForm } from "@mantine/form"
import dynamic from "next/dynamic"
import React, { useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { TextInput } from "../../../components/Text"
import { SegmentedControl } from "@mantine/core"
import ImageInput from "../../../components/ImageInput"

const CustomEditor = dynamic(() => import("@/components/customEditor"), {
    ssr: false,
})

const Edit = () => {

    const [lang, setLang] = useState<keyof typeof alias>('')
    const form = useForm({
        initialValues: {
            name: "",
            nameEN: "",
            nameJP: "",
            position: "",
            positionEN: "",
            positionJP: "",
            description: "",
            descriptionEN: "",
            descriptionJP: "",
            featuredImage: "",
        },
    }
    )

    const [loading, setLoading] = useState(true)

    let path: string
    useEffect(() => {
        path = window.location.pathname.split("/")[3]
        instance
            .get(`/staffs/${path}`)
            .then((res) => {
                form.setValues(res.data)
                setLoading(false)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [])


    const handlePublish = async () => {
        setLoading(true)
        if (form.validate().hasErrors) {
            setLoading(false)
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng điền đầy đủ thông tin!",
            })
            return
        }
        const id = form.getInputProps("id").value
        if (id) {
            await instance
                .patch(`/staffs/${id}`, form.values)
                .then(() => {
                    window.location.href = "/staffs"
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        window.location.href = "/signin"
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }

    const currentAlias = useMemo(() => alias[lang], [lang])

    return (
        <MainLayout>
            <Breadcrumb pageName="Nhân viên" link="/staffs" />
            {loading ? (
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
                        <SegmentedControl disabled={loading} data={langOptions} value={lang} onChange={setLang as any} />
                        <TextInput title={`Tên nhân viên ${currentAlias}`} {...form.getInputProps(`name${lang}`)} />
                        <TextInput title={`Vị trí ${currentAlias}`} {...form.getInputProps(`position${lang}`)} />
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Mô tả {currentAlias}
                            </label>
                            <div hidden={lang != ''}>
                                <CustomEditor {...form.getInputProps(`description`)} />
                            </div>
                            <div hidden={lang != 'JP'}>
                                <CustomEditor {...form.getInputProps(`descriptionJP`)} />
                            </div>
                            <div hidden={lang != 'EN'}>
                                <CustomEditor {...form.getInputProps(`descriptionEN`)} />
                            </div>
                        </div>
                        <ImageInput title="Ảnh nội bật" {...form.getInputProps("featuredImage")} />
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
    )
}

export default withAuth(Edit)
