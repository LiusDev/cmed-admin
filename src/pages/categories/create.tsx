import { Box, Breadcrumb, Button } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import withAuth from "@/hoc/withAuth";
import { alias, instance, langOptions } from "@/utils";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import React, { use, useCallback, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { TextInput } from "../../components/Text";
import { SegmentedControl } from "@mantine/core";

const Create = () => {
    const form = useForm({
        initialValues: {
            name: "",
            nameJP: "",
            nameEN: ""
        }
    })
    const [lang, setLang] = useState<keyof typeof alias>("");
    const currentAlias = useMemo(() => alias[lang], [lang]);
    const [buttonLoading, setButtonLoading] = useState(false);
    const router = useRouter();
    const handleCreateCategory = useCallback(async () => {
        setButtonLoading(true);
        if (form.validate().hasErrors) {
            setButtonLoading(false);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng điền đầy đủ thông tin!",
            });
            return;
        }
        await instance
            .post("/categories", form.values)
            .then((res) => {
                if (res.status === 201) {
                    router.push("/categories");
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    router.push("/signin");
                }
            })
            .finally(() => {
                setButtonLoading(false);
            });
    }, [form, router]);

    return (
        <MainLayout>
            <Breadcrumb pageName="Danh mục" link="/categories" />

            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white capitalize">
                        Tạo danh mục
                    </h3>
                </div>

                <div className="flex flex-col gap-5.5 p-6.5">
                    <SegmentedControl data={langOptions} value={lang} onChange={setLang as any} />
                    <TextInput title={`Tên danh mục ${currentAlias}`} {...form.getInputProps(`name${lang}`)} />

                    <div>
                        <Button
                            onClick={handleCreateCategory}
                            color="success"
                            variant="rounded"
                            className="w-full"
                            isLoading={buttonLoading}
                        >
                            Tạo
                        </Button>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
};

export default withAuth(Create);
