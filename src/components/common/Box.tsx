import { tw } from "@/utils";

const Box = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={tw(
                `rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${className}`
            )}
        >
            {children}
        </div>
    );
};

export default Box;
