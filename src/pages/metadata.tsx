import { Box, Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { alias, convertBase64, instance, langOptions } from "@/utils"
import { SegmentedControl } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import Swal from "sweetalert2"
import { TextInput } from "../components/Text"
import { NumberInput } from "../components/NumberInput"
import ImageInput from "../components/ImageInput"

const Metadata = () => {
    const [mounted, setMounted] = useState(false)
    const [lang, setLang] = useState<keyof typeof alias>("");
    const currentAlias = useMemo(() => alias[lang], [lang]);
    const [buttonLoading, setButtonLoading] = useState(false)

    const form = useForm({
        initialValues: {
            companyName: "",
            companyNameJP: "",
            comapnyNameEN: "",
            comapnyPhone: "",
            companyPhoneJP: "",
            companyPhoneEN: "",
            comapnyEmail: "",
            compnayEmailJP: "",
            companyEmailEN: "",
            comapnyAddress: "",
            companyAddressJP: "",
            companyAddressEN: "",
            ceoImage: "",
            quoteImage: "",
        }
    })

    useEffect(() => {
        instance
            .get("/metadata")
            .then((res) => {
                form.setValues(res.data)
                setMounted(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const router = useRouter()
    const handleUpdateData = useCallback(() => {
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
        instance
            .patch("/metadata", form.values)
            .then((res) => {
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật thành công",
                })
                router.push("/")
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "Có lỗi xảy ra",
                })
            })
    }, [form])

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
                    <div className="flex flex-col gap-5.5 p-6.5">
                    <SegmentedControl disabled={!mounted} data={langOptions} value={lang} onChange={setLang as any} />
                        <TextInput title={`Tên nhân viên ${currentAlias}`} {...form.getInputProps(`companyName${lang}`)} />
                        <NumberInput title={`Số điện thoại ${currentAlias}`} {...form.getInputProps(`companyPhone${lang}`)} />
                        <TextInput title="Email" {...form.getInputProps(`companyEmail${lang}`)} />
                        <TextInput title="Địa chỉ" {...form.getInputProps(`companyAddress${lang}`)} />
                        <ImageInput title="Ảnh CEO" {...form.getInputProps("ceoImage")} />
                        <ImageInput title="Ảnh nền Quote" {...form.getInputProps("quoteImage")} />
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

export default withAuth(Metadata)
