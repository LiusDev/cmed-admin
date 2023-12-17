import { Loader } from "@/components/common";
import { useRouter } from "next/router";
import React, { useEffect, FC, useState } from "react";

const withAuth = (WrappedComponent: FC) => {
    return (props: any) => {
        const [mount, setMount] = useState(false);

        const router = useRouter();
        useEffect(() => {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (!accessToken && !refreshToken) {
                router.push("/signin");
            } else {
                setMount(true);
            }
        }, []);

        // Pass through any additional props
        return mount ? <WrappedComponent {...props} /> : <Loader />;
    };
};

export default withAuth;
