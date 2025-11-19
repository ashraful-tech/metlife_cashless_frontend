"use client";
import { CustomDatePickerWithDays } from "@/components/molecules";
import { SearchInput } from "@/components/molecules/SearchInput";
import { Button } from "@material-tailwind/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Tab {
  title: string;
  value: string;
  queryPath: string;
}

const tabData: Tab[] = [
  { title: "PENDING", value: "COMPLETED", queryPath: "csAppointmentStatus" },
  { title: "COMPLETED", value: "COMPLETED", queryPath: "medicalStatus" },
  { title: "ALL", value: "ALL", queryPath: "medicalStatus" },
];
export const MedicalAssessmentFilter = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  return (
    <div className="grid grid-cols-12 items-end">
      <div className="col-span-5">
        {/* {tabData?.map((el, i) => (
					<Button
						key={i}
						// onClick={() => router?.push(`/medical-assessment?${el?.queryPath}=${el?.value}`)}
						onClick={() => handleTab(el)}
						className={`${
							active === el?.title ? "bg-primary text-white" : "bg-transparent text-black"
						} shadow-none text-sm hover:shadow-none py-2 px-3`}
					>
						{el?.title}
					</Button>
				))} */}
      </div>

      <div className="col-span-7">
        <div className="grid grid-cols-2 gap-4">
          <CustomDatePickerWithDays
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            placeholder="Select date range"
            label="From - To Date"
          />

          <div className="mt-10 w-full">
            <SearchInput
              searchKey="search"
              placeholder="Search by patient name, mobile number..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
