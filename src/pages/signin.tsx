import Head from "next/head";
import { instance } from "@/utils";
import { useState } from "react";
import { MdLockOutline, MdPersonOutline } from "react-icons/md";
import { useRouter } from "next/router";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "username") {
            setUsername(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await instance.post("/auth/signin", {
                username,
                password,
            });
            const { user, accessToken, refreshToken } = res.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

            router.push("/");
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Sign In</title>
                <meta name="description" content="Sign In" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="w-full h-screen flex items-center justify-center p-8">
                <div className="w-full max-w-150 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="w-full border-stroke dark:border-strokedark ">
                        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-center">
                                Sign in
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <input
                                            value={username}
                                            onChange={handleInput}
                                            name="username"
                                            type="text"
                                            placeholder="Enter your username"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />

                                        <MdPersonOutline className="absolute right-4 top-4 text-2xl opacity-50" />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            onChange={handleInput}
                                            value={password}
                                            name="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                        <MdLockOutline className="absolute right-4 top-4 text-2xl opacity-50" />
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={` flex items-center justify-center w-full rounded-lg border p-4 text-white transition ${
                                            loading
                                                ? "bg-body border-body cursor-not-allowed"
                                                : "bg-primary border-primary hover:bg-opacity-90 cursor-pointer"
                                        }`}
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-4 border-bodydark1 rounded-full flex items-center justify-center border-t-4 border-t-white animate-spin" />
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Login;
