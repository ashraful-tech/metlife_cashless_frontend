"use client";
import { CustomDatePickerWithDays } from "@/components/molecules";
import { SearchInput } from "@/components/molecules/SearchInput";
import { Button } from "@material-tailwind/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const AppoinmentFilter = () => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();
	const query = Object.fromEntries(searchParams.entries());


	return (
		<div className="grid grid-cols-12 items-end">
			<div className="col-span-7">

			</div>

			<div className="col-span-5">
				<div className="grid grid-cols-2 gap-4">
					<CustomDatePickerWithDays
						startDate={startDate}
						endDate={endDate}
						setStartDate={setStartDate}
						setEndDate={setEndDate}
						placeholder="Select date range"
						label="From - To Date"
					/>

					<div className="mt-5 w-full">
						<SearchInput searchKey="search" placeholder="Search by patient name, mobile number..." />
					</div>
				</div>
			</div>
		</div>
	);
};
