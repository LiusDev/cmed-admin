import { Box, Button, Breadcrumb } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import withAuth from "@/hoc/withAuth";
import { UserRole, roleLabels } from "@/types";
import { convertBase64, instance } from "@/utils";
import { Select } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Create = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<string>(UserRole.STAFF);
    const [loading, setLoading] = useState(false);

    const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleChangeRole = (v: string | null) => {
        if (v)
            setRole(v);
    };

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const validateData = (): boolean => {
        if (
            username.trim() === "" ||
            password.trim() === "" ||
            name.trim() === ""
        ) {
            return false;
        }
        return true;
    };

    const router = useRouter();

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
        instance
            .post("/users", {
                username,
                name,
                password,
                role,
            })
            .then(() => {
                router.push("/users");
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    router.push("/signin");
                }
                if (err.response.status === 403) {
                    window.location.href = "/";
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <MainLayout>
            <Breadcrumb pageName="Tài khoản" link="/users" />
            <Box className="max-w-230 m-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Tạo tài khoản
                    </h3>
                </div>
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-3">
                            <label className="mb-3 block text-black dark:text-white">
                                Tên đăng nhập
                            </label>
                            <input
                                value={username}
                                onChange={handleChangeUsername}
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="mb-3 block text-black dark:text-white">
                                Phân quyền
                            </label>
                            <Select
                                styles={{
                                    input: {
                                        height: 50
                                    }
                                }}
                                value={role}
                                onChange={handleChangeRole}
                                data={
                                    [
                                        { label: roleLabels[UserRole.ADMIN], value: UserRole.ADMIN },
                                        { label: roleLabels[UserRole.STAFF], value: UserRole.STAFF }
                                    ]

                                } />
                        </div>
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Mật khẩu
                        </label>
                        <input
                            value={password}
                            onChange={handleChangePassword}
                            type="password"
                            placeholder="Nhập mật khẩu"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Tên hiển thị
                        </label>
                        <input
                            value={name}
                            onChange={handleChangeName}
                            type="text"
                            placeholder="Nhập tên"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <Button
                            onClick={handlePublish}
                            color="success"
                            variant="rounded"
                            className="w-full"
                            isLoading={loading}
                        >
                            Tạo tài khoản
                        </Button>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
};

export default withAuth(Create);
