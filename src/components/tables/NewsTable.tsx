import { instance } from "@/utils";
import Link from "next/link";
import parse, { Element, HTMLReactParserOptions } from "html-react-parser";

import {
    MdOutlineDelete,
    MdOutlineEdit,
    MdOutlineRemoveRedEye,
} from "react-icons/md";

interface NewsTableProps {
    id: number;
    title: string;
    content: string;
}

const options: HTMLReactParserOptions = {
    replace: (domNode) => {
        const typedNode = domNode as Element;
        if (typedNode.name === "img") {
            return <></>;
        }
    },
};

const Table = ({
    tableData,
    setTableData,
}: {
    tableData: NewsTableProps[];
    setTableData: (arg: any) => void;
}) => {
    const handleDelete = (id: number) => {
        instance.delete(`/news/${id}`).then((res) => {
            console.log(res);
            // delete item with id from tableData
            const filteredTableData = tableData!.filter(
                (item) => item.id !== id
            );
            setTableData(filteredTableData);
        });
    };
    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                Title
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Content
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData &&
                            tableData.map(({ id, title, content }) => (
                                <tr key={id}>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {title}
                                        </h5>
                                        {/* <p className="text-sm">TestPrice</p> */}
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {parse(content, options)}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <Link
                                                href={`/news/${id}`}
                                                className="hover:text-primary"
                                            >
                                                <MdOutlineRemoveRedEye className="text-xl" />
                                            </Link>
                                            <Link
                                                href={`/news/edit/${id}`}
                                                className="hover:text-success"
                                            >
                                                <MdOutlineEdit className="text-xl" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(id)}
                                                className="hover:text-danger"
                                            >
                                                <MdOutlineDelete className="text-xl" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
