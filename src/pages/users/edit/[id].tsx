import { Box, Button, Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { TableSkeleton } from "@/components/skeletons"
import withAuth from "@/hoc/withAuth"
import { UserRole, roleLabels } from "@/types"
import { instance } from "@/utils"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

const Update = () => {
    const [mount, setMount] = useState(false)
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(false)

    let path: string
    useEffect(() => {
        path = window.location.pathname.split("/")[3]
        instance
            .get(`/users/${path}`)
            .then((res) => {
                setUsername(res.data.username)
                setName(res.data.name)
                setRole(res.data.role)
                setMount(true)
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin"
                }
            })
    }, [])

    const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(e.target.value)
    }

    const validateData = (): boolean => {
        if (username.trim() === "" || name.trim() === "") {
            return false
        }
        return true
    }

    const router = useRouter()
    const handlePublish = async () => {
        path = window.location.pathname.split("/")[3]
        setLoading(true)
        if (!validateData()) {
            setLoading(false)
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng điền đầy đủ thông tin!",
            })
            return
        }
        instance
            .patch(`/users/${path}`, {
                username,
                name,
                role,
            })
            .then(() => {
                router.push("/users")
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    router.push("/signin")
                }
                if (err.response.status === 403) {
                    window.location.href = "/"
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <MainLayout>
            <Breadcrumb pageName="Tài khoản" link="/users" />
            {!mount ? (
                <TableSkeleton
                    rows={3}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Cập nhật tài khoản
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
                                <select
                                    value={role}
                                    onChange={handleChangeRole}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    <option
                                        key={UserRole.ADMIN}
                                        value={UserRole.ADMIN}
                                    >
                                        {roleLabels[UserRole.ADMIN]}
                                    </option>
                                    <option
                                        key={UserRole.STAFF}
                                        value={UserRole.STAFF}
                                    >
                                        {roleLabels[UserRole.STAFF]}
                                    </option>
                                </select>
                            </div>
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
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    )
}

export default withAuth(Update)
