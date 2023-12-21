import { CardDataStats } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import withAuth from "@/hoc/withAuth";
import { instance } from "@/utils";
import { useEffect, useState } from "react";
import {
    MdNewspaper,
    MdLightbulbOutline,
    MdOutlineDocumentScanner,
} from "react-icons/md";

const Home = () => {
    const [news, setNews] = useState([]);
    const [projects, setProjects] = useState([]);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        instance
            .get("/news?perPage=1000")
            .then((res) => {
                setNews(res.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
        instance
            .get("/projects?perPage=1000")
            .then((res) => {
                setProjects(res.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
        instance
            .get("/documents?perPage=1000")
            .then((res) => {
                setDocuments(res.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
    }, []);

    return (
        <MainLayout>
            <div className="grid grid-cols-3 gap-12">
                <CardDataStats
                    title="Tổng số bài viết"
                    total={news.length.toString()}
                >
                    <MdNewspaper className="text-2xl text-primary/80" />
                </CardDataStats>
                <CardDataStats
                    title="Tổng số tài liệu"
                    total={documents.length.toString()}
                >
                    <MdOutlineDocumentScanner className="text-2xl text-primary/80" />
                </CardDataStats>
                <CardDataStats
                    title="Tổng số dự án"
                    total={projects.length.toString()}
                >
                    <MdLightbulbOutline className="text-2xl text-primary/80" />
                </CardDataStats>
            </div>
        </MainLayout>
    );
};

export default withAuth(Home);
