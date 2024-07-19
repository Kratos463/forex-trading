"use client"

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WithdrawalRequestTable from "@/components/WithdrawalRequest/WithdrawalRequestTable";

const CalendarPage = () => {
  return (
    <DefaultLayout>
      <WithdrawalRequestTable />
    </DefaultLayout>
  );
};

export default CalendarPage;