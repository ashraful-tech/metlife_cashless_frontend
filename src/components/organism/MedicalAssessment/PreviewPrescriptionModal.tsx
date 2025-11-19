"use client";

import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import { FC } from "react";

interface PrescriptionItem {
  name: string;
  dosage: string;
  frequency: string;
}

interface PreviewPrescriptionModalProps {
  open: boolean;
  onClose: () => void;
  doctorName?: string;
  patientName?: string;
  patientId?: string;
  diagnosis?: string;
  medicines?: PrescriptionItem[];
  advice?: string;
}

export const PreviewPrescriptionModal: FC<PreviewPrescriptionModalProps> = ({
  open,
  onClose,
  doctorName,
  patientName,
  patientId,
  diagnosis,
  medicines = [],
  advice,
}) => {
  return (
    <Dialog size="lg" open={open} handler={onClose}>
      <DialogHeader>
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Prescription Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-xl">
            ✕
          </button>
        </div>
      </DialogHeader>

      <DialogBody divider className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Patient Info */}
        <div>
          <h3 className="text-base font-semibold mb-1">Patient Information</h3>
          <p>
            <span className="font-medium">Name:</span> {patientName || "N/A"}
          </p>
          <p>
            <span className="font-medium">Patient ID:</span>{" "}
            {patientId || "N/A"}
          </p>
        </div>

        {/* Doctor Info */}
        <div>
          <h3 className="text-base font-semibold mb-1">Doctor</h3>
          <p>{doctorName || "N/A"}</p>
        </div>

        {/* Diagnosis */}
        {diagnosis && (
          <div>
            <h3 className="text-base font-semibold mb-1">Diagnosis</h3>
            <p>{diagnosis}</p>
          </div>
        )}

        {/* Medicines */}
        <div>
          <h3 className="text-base font-semibold mb-2">Medicines</h3>

          {medicines.length === 0 && (
            <p className="text-gray-500">No medicines added.</p>
          )}

          <ul className="space-y-2">
            {medicines.map((med, index) => (
              <li
                key={index}
                className="border p-2 rounded-md bg-gray-50 text-sm">
                <p>
                  <span className="font-semibold">Name:</span> {med.name}
                </p>
                <p>
                  <span className="font-semibold">Dosage:</span> {med.dosage}
                </p>
                <p>
                  <span className="font-semibold">Frequency:</span>{" "}
                  {med.frequency}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Advice */}
        {advice && (
          <div>
            <h3 className="text-base font-semibold mb-1">Doctor Advice</h3>
            <p>{advice}</p>
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
};
