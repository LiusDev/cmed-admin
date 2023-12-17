import { Button, Breadcrumb } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import NewsTable from "@/components/tables/NewsTable";
import withAuth from "@/hoc/withAuth";
import { instance } from "@/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const News = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        instance
            .get("/news/all")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <MainLayout title="News">
            <Breadcrumb pageName="News" link="/">
                <Button
                    color="success"
                    variant="rounded"
                    size="large"
                    href="/news/create"
                >
                    Create
                </Button>
            </Breadcrumb>
            {!data || data.length === 0 ? (
                <TableSkeleton columns={3} />
            ) : (
                <NewsTable tableData={data} setTableData={setData} />
            )}
        </MainLayout>
    );
};
export default withAuth(News);
