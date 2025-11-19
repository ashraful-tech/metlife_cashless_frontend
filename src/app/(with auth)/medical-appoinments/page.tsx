"use client";

import { useState, useEffect } from "react";

import {
  IAllAppointmentData,
  AppointmentData,
} from "@/libs/api/interface/assuarace";
import { assuranceAPI } from "@/libs/api";
import { PrescriptionFormPage } from "@/components/organism/MedicalAssessment/PrescriptionFormPage";
import { PreviousAppointment } from "@/components/organism/MedicalAssessment/PreviousAppointments";

export default function MedicalAppointmentsPage() {
  const [selectData, setSelectData] = useState<AppointmentData | null>(null);
  const [appointmentId, setAppointmentId] = useState("");

  const [appointmentDetails, setAppointmentDetails] =
    useState<AppointmentData | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Sync appointmentId when selectData changes
  useEffect(() => {
    if (selectData?.id) setAppointmentId(selectData.id);
  }, [selectData?.id]);

  // Fetch appointment details
  useEffect(() => {
    if (!appointmentId) return;

    const fetchAppointmentDetails = async () => {
      setDetailsLoading(true);
      try {
        const res = await assuranceAPI.getAppointmentById(appointmentId);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAppointmentDetails(res.data[0]);
        } else {
          setAppointmentDetails(null);
        }
      } catch (err) {
        console.error("Failed to fetch appointment details", err);
        setAppointmentDetails(null);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId]);

  return (
    <div className="bg-gray-100 p-2 mt-12 relative">
      <div className="grid grid-cols-12 gap-2">
        {/* LEFT: Prescription Form */}
        <div className="col-span-9 bg-white p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Medical Appointments
            </h1>
          </div>

          <PrescriptionFormPage
            selectData={appointmentDetails || selectData || null}
            onIdChange={setAppointmentId}
          />
        </div>

        {/* RIGHT: Previous Appointments */}
        <div className="col-span-3 bg-white p-4 rounded-md shadow-md flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">
            Previous History
          </h1>

          <div className="flex-1 overflow-y-auto max-h-[600px]">
            {detailsLoading ? (
              <p>Loading previous appointments...</p>
            ) : appointmentId ? (
              <PreviousAppointment appointmentId={appointmentId} />
            ) : (
              <p className="text-gray-500">
                Select a patient to see previous history.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
