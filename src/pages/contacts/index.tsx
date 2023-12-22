import { Breadcrumb, Button } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import { Contact, isPersonalLabel } from "@/types";
import { convertDate, instance } from "@/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";

const PAGE_SIZE = 500;

const Contacts = () => {
    const [data, setData] = useState<Contact[] | null>(null);
    useEffect(() => {
        instance
            .get(`/contacts?perPage=${PAGE_SIZE}`)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
    }, []);

    const [searchName, setSearchName] = useState<string>("");
    const [searchEmail, setSearchEmail] = useState<string>("");
    const [searchPhone, setSearchPhone] = useState<string>("");
    const [searchCompany, setSearchCompany] = useState<string>("");

    const handleSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value);
    };

    const handleSearchEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchEmail(e.target.value);
    };

    const handleSearchPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchPhone(e.target.value);
    };

    const handleSearchCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchCompany(e.target.value);
    };

    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const handleSearch = () => {
        setSearchLoading(true);
        instance
            .get(
                `/contacts?perPage=${PAGE_SIZE}&name=${searchName}&email=${searchEmail}&phone=${searchPhone}&company=${searchCompany}`
            )
            .then((res) => {
                setData(res.data);
                setSearchLoading(false);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
    };
    return (
        <MainLayout>
            <Breadcrumb pageName="Liên hệ" link="" />
            {!data ? (
                <TableSkeleton rows={5} columns={6} />
            ) : (
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        <input
                                            value={searchName}
                                            onChange={handleSearchName}
                                            type="text"
                                            placeholder="Tên"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        <input
                                            value={searchEmail}
                                            onChange={handleSearchEmail}
                                            type="text"
                                            placeholder="Email"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        <input
                                            value={searchPhone}
                                            onChange={handleSearchPhone}
                                            type="text"
                                            placeholder="Số điện thoại"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        <input
                                            value={searchCompany}
                                            onChange={handleSearchCompany}
                                            type="text"
                                            placeholder="Công ty"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Loại
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Ngày tạo
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        <Button
                                            size="small"
                                            variant="rounded"
                                            onClick={handleSearch}
                                            isLoading={searchLoading}
                                            className="w-36"
                                        >
                                            Tìm kiếm
                                        </Button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={10}>
                                            <div className="text-black/70 dark:text-white/70 w-full flex items-center justify-center h-20 font-medium">
                                                Không có dữ liệu
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map(
                                        ({
                                            id,
                                            name,
                                            email,
                                            phone,
                                            company,
                                            isPersonal,
                                            createdAt,
                                        }) => (
                                            <tr key={id}>
                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                    <h5 className="font-medium text-black dark:text-white">
                                                        {name}
                                                    </h5>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">
                                                        {email}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">
                                                        {phone}
                                                    </p>
                                                </td>

                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">
                                                        {company}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">
                                                        {isPersonalLabel(
                                                            isPersonal
                                                        )}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">
                                                        {convertDate(createdAt)}
                                                    </p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <div className="flex items-center space-x-3.5">
                                                        <Link
                                                            href={`/contacts/${id}`}
                                                            className="hover:text-primary"
                                                        >
                                                            <MdOutlineRemoveRedEye className="text-xl" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Contacts;
