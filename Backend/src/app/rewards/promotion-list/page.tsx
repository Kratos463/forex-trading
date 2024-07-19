"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PromotionTable from "@/components/Rewards/Promotion-list";

const Rewards = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Promotion List" />
            <PromotionTable />
        </DefaultLayout>
    );
};

export default Rewards;
