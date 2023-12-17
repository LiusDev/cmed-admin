import MainLayout from "@/components/layouts/MainLayout";
import withAuth from "@/hoc/withAuth";

const Home = () => {
    return <MainLayout>OK</MainLayout>;
};

export default withAuth(Home);
