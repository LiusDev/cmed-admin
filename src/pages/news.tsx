import MainLayout from "@/components/layouts/MainLayout";
import NewsTable from "@/components/tables/NewsTable";
import withAuth from "@/hoc/withAuth";
import { instance } from "@/utils";
import { useEffect, useState } from "react";
const LoadingTable = () => {
    return (
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="animate-pulse">
                <div className="h-10 w-full bg-bodydark1 dark:bg-boxdark-2"></div>
            </div>
        </div>
    );
};
const News = () => {
    const [mount, setMount] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        instance
            .get("/news/all")
            .then((res) => {
                setData(res.data);
                setMount(true);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <MainLayout title="News">
            {!mount ? <LoadingTable /> : <NewsTable tableData={data} />}
        </MainLayout>
    );
};
export default withAuth(News);
