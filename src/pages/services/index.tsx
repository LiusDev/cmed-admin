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
                description: "Đầu tư hạ tầng",
                id: 2,
            },
            {
                description: "Tư vấn vận hành",
                id: 3,
            },
            {
                description: "Tư vấn pháp lý",
                id: 4,
            },
            {
                description: "Tư vấn nhân sự",
                id: 5,
            },
            {
                description: "Công nghệ thông tin",
                id: 6,
            },
        ],
    },
    {
        value: "Phòng khám chuyên khoa",
        data: [
            {
                description: "Đầu tư hạ tầng",
                id: 7,
            },
            {
                description: "Tư vấn vận hành",
                id: 8,
            },
            {
                description: "Tư vấn pháp lý",
                id: 9,
            },
            {
                description: "Tư vấn nhân sự",
                id: 10,
            },
            {
                description: "Công nghệ thông tin",
                id: 11,
            },
        ],
    },
    {
        value: "Viện dưỡng lão",
        data: [
            {
                description: "Đầu tư hạ tầng",
                id: 12,
            },
            {
                description: "Tư vấn vận hành",
                id: 13,
            },
            {
                description: "Tư vấn pháp lý",
                id: 14,
            },
            {
                description: "Tư vấn nhân sự",
                id: 15,
            },
            {
                description: "Công nghệ thông tin",
                id: 16,
            },
        ],
    },
    {
        value: "Bệnh viện",
        data: [
            {
                description: "Đầu tư hạ tầng",
                id: 17,
            },
            {
                description: "Tư vấn vận hành",
                id: 18,
            },
            {
                description: "Tư vấn pháp lý",
                id: 19,
            },
            {
                description: "Tư vấn nhân sự",
                id: 20,
            },
            {
                description: "Công nghệ thông tin",
                id: 21,
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
