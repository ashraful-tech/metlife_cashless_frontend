"use client";

import { useEffect, useState } from "react";
import { assuranceAPI } from "@/libs/api";

interface Medicine {
  name: string;
  dosage: string;
  quantity: string;
  instructions: string;
}

interface AppointmentData {
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  doctorName: string;
  complaints: string[];
  medicines: Medicine[];
  createdAt: string;
  updatedAt: string;
}

interface Props {
  appointmentId: string;
}

export const PreviousAppointment: React.FC<Props> = ({ appointmentId }) => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(false);

  const formatDateTime12hr = (dateString: string) => {
    const d = new Date(dateString);

    // Format date: DD-MM-YYYY
    const datePart = d.toLocaleDateString("en-GB").replaceAll("/", "-");

    // Format time: hh:mm AM/PM
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${datePart} ${hours}:${minutesStr} ${ampm}`;
  };

  // Example:
  console.log(formatDateTime12hr("2025-11-17T14:05:00")); // "17-11-2025 2:05 PM"
  console.log(formatDateTime12hr("2025-11-17T08:07:00")); // "17-11-2025 8:07 AM"

  useEffect(() => {
    if (!appointmentId) {
      setAppointments([]); // ❗ Clear old data when ID is empty
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setAppointments([]); // ❗ Clear previous data immediately

      try {
        const res = await assuranceAPI.getAppointmentById(appointmentId);
        console.log("Previous Appointments Response:", res.data);

        if (Array.isArray(res.data) && res.data.length > 0) {
          setAppointments(res.data);
        } else {
          setAppointments([]); // ❗ Ensure no leftover data
        }
      } catch (err) {
        console.error("Failed to fetch appointment details:", err);
        setAppointments([]); // ❗ Prevent showing old results on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId]);

  if (loading) return <div>Loading...</div>;
  if (!appointments.length)
    return <div>No User or previous appointments found.</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-md shadow-md">
      {appointments.map((appt, idx) => (
        <div key={idx} className="mb-2 p-2 border rounded bg-gray-50">
          <p className="text-xs font-semibold mb-1">
            Doctor: {appt.doctorName} | {formatDateTime12hr(appt.createdAt)}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {appt.complaints.length > 0 && (
              <div className="">
                <p className="text-xs font-semibold">Complaints:</p>
                <ul className="text-xs list-disc list-inside">
                  {appt.complaints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {appt.medicines.length > 0 && (
              <div className="">
                <p className="font-semibold text-xs">Medicines:</p>
                <ul className="text-xs list-disc list-inside">
                  {appt.medicines.map((m, i) => (
                    <li key={i}>
                      {m.name} — {m.dosage} — Qty: {m.quantity} —{" "}
                      {m.instructions}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
