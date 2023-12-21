import { Box, Breadcrumb, Button, NotiModal } from "@/components/common";
import MainLayout from "@/components/layouts/MainLayout";
import { TableSkeleton } from "@/components/skeletons";
import withAuth from "@/hoc/withAuth";
import type { Category, News } from "@/types";
import { convertBase64, instance, parseContent } from "@/utils";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const FroalaEditorComponent = dynamic(
    () => import("@/components/customEditor"),
    {
        ssr: false,
    }
);

const Edit = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [news, setNews] = useState<News | null>(null);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<Category["id"]>(1);
    const [description, setDescription] = useState("");
    const [featuredImage, setFeaturedImage] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    let path: string;
    useEffect(() => {
        path = window.location.pathname.split("/")[3];
        instance
            .get(`/categories`)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
        instance
            .get(`/news/${path}`)
            .then((res) => {
                setNews(res.data);
                setTitle(res.data.title);
                setCategory(res.data.category.id);
                setDescription(res.data.description);
                setFeaturedImage(res.data.featuredImage);
                setContent(res.data.content);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.href = "/signin";
                }
            });
    }, []);

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(parseInt(e.target.value));
    };

    const handleChangeDescription = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescription(e.target.value);
    };

    const handleUploadFeaturedImage = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const base64image = await convertBase64(file);
            setFeaturedImage(base64image);
        }
    };

    const validateData = (): boolean => {
        if (
            title.trim() === "" ||
            description.trim() === "" ||
            featuredImage === "" ||
            content.trim() === ""
        ) {
            return false;
        }
        return true;
    };

    const handlePublish = async () => {
        setLoading(true);
        if (!validateData()) {
            setLoading(false);
            setIsModalOpen(true);
            return;
        }
        const newContent = await parseContent(content);
        const body = {
            title,
            categoryId: category,
            description,
            featuredImage,
            content: newContent,
        };
        if (news) {
            await instance
                .patch(`/news/${news.id}`, body)
                .then(() => {
                    window.location.href = "/news";
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        window.location.href = "/signin";
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <Breadcrumb pageName="Bài viết" link="/news" />
            {!news ? (
                <TableSkeleton
                    rows={4}
                    columns={1}
                    className="max-w-230 m-auto"
                />
            ) : (
                <Box className="max-w-230 m-auto">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Chỉnh sửa bài viết
                        </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                        <div className="grid grid-cols-5 gap-2">
                            <div className="col-span-3">
                                <label className="mb-3 block text-black dark:text-white">
                                    Tiêu đề
                                </label>
                                <input
                                    value={title}
                                    onChange={handleChangeTitle}
                                    type="text"
                                    placeholder="Tiêu đề bài viết"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="mb-3 block text-black dark:text-white">
                                    Danh mục
                                </label>
                                <select
                                    onChange={handleChangeCategory}
                                    value={category}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Mô tả
                            </label>
                            <input
                                value={description}
                                onChange={handleChangeDescription}
                                type="text"
                                placeholder="Mô tả bài viết"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Ảnh nổi bật
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadFeaturedImage}
                                className="mb-3 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                            />
                            {featuredImage && (
                                <img
                                    src={featuredImage}
                                    alt="featured image"
                                    className="h-40 object-cover rounded-sm"
                                />
                            )}
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Nội dung
                            </label>
                            <FroalaEditorComponent
                                model={content}
                                setModel={setContent}
                            />
                        </div>
                        <div>
                            <Button
                                onClick={handlePublish}
                                color="success"
                                variant="rounded"
                                isLoading={loading}
                                className="w-full"
                            >
                                Lưu
                            </Button>
                            <NotiModal
                                show={isModalOpen}
                                setShow={setIsModalOpen}
                                title="Lỗi"
                                description="Vui lòng nhập đầy đủ thông tin"
                                type="error"
                            />
                        </div>
                    </div>
                </Box>
            )}
        </MainLayout>
    );
};

export default withAuth(Edit);
