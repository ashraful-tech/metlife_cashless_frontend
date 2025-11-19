"use client";

import {
  MedicalAssessmentFilter,
  MedicalAssessmentLists,
  MedicalAssessmentModal,
} from "@/components/organism/MedicalAssessment";
import { assuranceAPI } from "@/libs/api";
import { IAllAppointmentData } from "@/libs/api/interface/assuarace";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const MedicalAssessmentUnit = () => {
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [tableData, setTableData] = useState<IAllAppointmentData | null>(null);
  const [selectdata, setSelectData] = useState<any>(null);

  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  const { csAppointmentStatus, medicalStatus, status, page, search } = query;

  const getTableData = async () => {
    if (!query?.medicalStatus) {
      query.medicalStatus = "PENDING";
      query.csAppointmentStatus = "COMPLETED";
      query.isRequiredMedical = "true";
    }
    // if (!query?.csAppointmentStatus)

    setTableDataLoading(true);
    try {
      const { success, data, message } = await assuranceAPI.getAppointmentData(
        query
      );

      if (success) setTableData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setTableDataLoading(false);
    }
  };

  useEffect(() => {
    getTableData();
  }, [csAppointmentStatus, medicalStatus, status, page, search]);

  return (
    <div className="mt-[-80px]">
      {/* <MedicalAssessmentFilter /> */}

      <MedicalAssessmentLists
        data={tableData as any}
        loading={tableDataLoading}
        selectdata={selectdata}
        setSelectData={setSelectData}
        updateData={getTableData}
      />

      {selectdata && (
        <MedicalAssessmentModal
          selectdata={selectdata}
          close={() => setSelectData(null)}
          updateData={getTableData}
        />
      )}
    </div>
  );
};
