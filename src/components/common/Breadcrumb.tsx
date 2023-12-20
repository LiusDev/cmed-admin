import Link from "next/link";
interface BreadcrumbProps {
    pageName: string;
    link: string;
    children?: React.ReactNode;
}
const Breadcrumb = ({ pageName, link, children }: BreadcrumbProps) => {
    return (
        <div className="mb-6 flex gap-3 items-center justify-between">
            <div>
                <Link className="font-medium" href="/">
                    Quản lý /
                </Link>
                <Link href={link}>
                    <h2 className="text-title-md2 font-semibold text-primary ">
                        {pageName}
                    </h2>
                </Link>
            </div>

            <div>{children}</div>
        </div>
    );
};

export default Breadcrumb;
