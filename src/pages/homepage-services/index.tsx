import { Breadcrumb, Button } from "@/components/common"
import MainLayout from "@/components/layouts/MainLayout"
import React from "react"

const homepageServices = [
    {
        label: "Dịch vụ 1",
        id: 10,
    },
    {
        label: "Dịch vụ 2",
        id: 11,
    },
    {
        label: "Dịch vụ 3",
        id: 12,
    },
]

const HomePageServices = () => {
    return (
        <MainLayout>
            <Breadcrumb pageName="Dịch vụ trang chủ" link=""></Breadcrumb>
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="grid grid-cols-3 gap-8">
                    {homepageServices.map((service) => (
                        <Button
                            href={`/services/edit/${service.id}`}
                            key={service.id}
                            className="h-30 flex items-center justify-center"
                        >
                            {service.label}
                        </Button>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}

export default HomePageServices
