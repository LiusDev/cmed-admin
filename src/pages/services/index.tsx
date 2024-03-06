import { Breadcrumb } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import { Accordion } from "@mantine/core"
import Link from "next/link"
import React from "react"

const services = [
    {
        value: "Phòng khám đa khoa",
        data: [
            {
                description: "Tư vấn tổng thể",
                id: 1,
            },
            {
                description: "Pháp lý",
                id: 2,
            },
            {
                description: "Nhân sự",
                id: 3,
            },
        ],
    },
    {
        value: "Phòng khám chuyên khoa",
        data: [
            {
                description: "Tư vấn tổng thể",
                id: 4,
            },
            {
                description: "Pháp lý",
                id: 5,
            },
            {
                description: "Nhân sự",
                id: 6,
            },
        ],
    },
    {
        value: "Viện dưỡng lão",
        data: [
            {
                description: "Tư vấn tổng thể",
                id: 7,
            },
            {
                description: "Pháp lý",
                id: 8,
            },
            {
                description: "Nhân sự",
                id: 9,
            },
        ],
    },
    {
        value: "Bệnh viện",
        data: [
            {
                description: "Tư vấn tổng thể",
                id: 7,
            },
            {
                description: "Pháp lý",
                id: 8,
            },
            {
                description: "Nhân sự",
                id: 9,
            },
        ],
    },
]

const ServicePage = () => {
    return (
        <MainLayout>
            <Breadcrumb pageName="Dịch vụ" link=""></Breadcrumb>

            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <Accordion variant="separated">
                    {services.map((service) => (
                        <Accordion.Item
                            key={service.value}
                            value={service.value}
                        >
                            <Accordion.Control icon={<></>}>
                                {service.value}
                            </Accordion.Control>
                            <Accordion.Panel>
                                <div className="flex flex-col gap-2">
                                    {service.data.map((data) => (
                                        <Link
                                            key={data.id}
                                            href={`/services/edit/${data.id}`}
                                            className="ml-5 text-black"
                                        >
                                            {data.description}
                                        </Link>
                                    ))}
                                </div>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>
        </MainLayout>
    )
}

export default ServicePage
