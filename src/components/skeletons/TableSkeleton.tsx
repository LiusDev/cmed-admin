import { tw } from "@/utils";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    className?: string;
}

const Cell = () => (
    <td className="p-4">
        <div className="animate-pulse h-10 bg-bodydark1 dark:bg-boxdark-2"></div>
    </td>
);

const TableSkeleton = ({
    rows = 5,
    columns = 4,
    className,
}: TableSkeletonProps) => {
    return (
        <table
            className={tw(
                ` rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark w-full ${className}`
            )}
        >
            <tbody className="bg-white dark:bg-boxdark border-stroke dark:border-strokedark p-4 w-full">
                {[...Array(rows)].map((_, i) => (
                    <tr key={i}>
                        {[...Array(columns)].map((_, j) => (
                            <Cell key={j} />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableSkeleton;
