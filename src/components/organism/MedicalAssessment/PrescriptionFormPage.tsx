"use client";

import { FC, useEffect, useState } from "react";
import { FormInput, FormInputSelect, IItems } from "@/components/atomic";
import { Button } from "@material-tailwind/react";
import { PreviewPrescriptionModal } from "./PreviewPrescriptionModal";
import { AppointmentData } from "@/libs/api/interface/assuarace";
import { assuranceAPI } from "@/libs/api";
import { getUserState } from "@/store/actions";
import { useSelector } from "react-redux";

interface Medicine {
  name: string;
  dosage: string;
  quantity: string;
  instructions: string;
}

interface PropsType {
  selectdata: AppointmentData;
  onIdChange?: (id: string) => void;
  usertype?: {
    username: string;
  };
}

const timeOptions: IItems[] = [
  { label: "দিন", value: "day" },
  { label: "সপ্তাহ", value: "week" },
  { label: "মাস", value: "month" },
];

const takeTime: IItems[] = [
  { label: "খাবার আগে", value: "before meal" },
  { label: "খাবার পরে", value: "after meal" },
];

const doseOptions: IItems[] = [
  { label: "1+1+1", value: "1+1+1" },
  { label: "1+0+1", value: "1+0+1" },
  { label: "0+1+0", value: "0+1+0" },
  { label: "Custom", value: "custom" },
];

export const PrescriptionFormPage: FC<PropsType> = ({
  selectdata,
  onIdChange,
}) => {
  const [id, setId] = useState(selectdata?.id || "");
  const [name, setName] = useState(selectdata?.name || "");
  const [mobile, setMobile] = useState(selectdata?.phone || "");
  const [email, setEmail] = useState(selectdata?.email || "");
  const [department, setDepartment] = useState(selectdata?.department || "");

  const [complaintSuggestions, setComplaintSuggestions] = useState<string[]>(
    []
  );
  const [complaint, setComplaint] = useState("");
  const [time, setTime] = useState("");
  const [selectTime, setSelectedTime] = useState("");

  const [complaintsList, setComplaintsList] = useState<
    { complaint: string; time: string; selectTime: string }[]
  >([]);

  const [medicine, setMedicine] = useState("");
  const [medicineSuggestions, setMedicineSuggestions] = useState<string[]>([]);
  const [dose, setDose] = useState("");
  const [customDose, setCustomDose] = useState("");
  const [quantity, setQuantity] = useState("");
  const [duration, setDuration] = useState("");
  const [selectTime1, setSelectedTime1] = useState("");
  const [whenToTake, setWhenToTake] = useState("");
  const [notes, setNotes] = useState("");
  const [prescribedList, setPrescribedList] = useState<any[]>([]);

  const [previewOpen, setPreviewOpen] = useState(false);

  const { userData } = useSelector(getUserState);

  console.log("User Data in UserInfo:", userData?.name);

  // -------------------- Fetch Appointment by ID --------------------
  useEffect(() => {
    setName("");
    setMobile("");
    setEmail("");
    setDepartment("");
    setComplaintsList([]);
    setPrescribedList([]);

    if (!id) {
      onIdChange?.(id);
      return;
    }
    console.log("Fetch Appointment by ID called");
    const timer = setTimeout(async () => {
      try {
        const res = await assuranceAPI.getAppointmentById(id);
        const d = res.data;
        console.log("Fetch Appointment by ID called 2");
        if (!d) {
          onIdChange?.(id);
          return;
        }

        setName(d.name || "");
        setMobile(d.phone || "");
        setEmail(d.email || "");
        setDepartment(d.department || "");

        setComplaintsList(
          d.complaints?.map((c: string) => ({
            complaint: c,
            time: "",
            selectTime: "",
          })) || []
        );

        setPrescribedList(
          d.medicines?.map((m: Medicine) => ({
            medicine: m.name,
            dose: m.dosage,
            quantity: m.quantity,
            whenToTake: m.instructions,
          })) || []
        );

        onIdChange?.(id);
      } catch (err) {
        console.error("Failed to fetch appointment", err);
        setName("");
        setMobile("");
        setEmail("");
        setDepartment("");
        setComplaintsList([]);
        setPrescribedList([]);
        onIdChange?.(id);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [id, onIdChange]);

  // -------------------- Fetch suggested complaints --------------------
  useEffect(() => {
    if (!complaint.trim()) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.zaynax.health/doctor_service/public/doctors/suggested-symptoms?search=${complaint}`
        );
        const data = await res.json();
        setComplaintSuggestions(data?.data || []);
      } catch {
        setComplaintSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [complaint]);

  // -------------------- Fetch suggested medicines --------------------
  useEffect(() => {
    if (!medicine.trim()) {
      setMedicineSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.zaynax.health/product_service/medicine/brand/prescription_recomended_new?query=${medicine}`
        );
        const data = await res.json();
        setMedicineSuggestions(
          data?.data?.map((item: any) => item.name || "") || []
        );
      } catch {
        setMedicineSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [medicine]);

  // -------------------- Save --------------------
  const [saveClicked, setSaveClicked] = useState(false);

  const saveAppointment = async () => {
    if (!id || !name || !mobile || !email || !department) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const payload = {
        employeeId: String(id),
        name: String(name),
        phone: String(mobile),
        email: String(email),
        department: String(department),
        doctorName: userData?.name || "Unknown Doctor",
        complaints: complaintsList.map(
          (c) => `${c.complaint} ${c.time} ${c.selectTime}`
        ),
        medicines: prescribedList.map((p) => ({
          name: String(p.medicine),
          dosage: String(p.dose),
          quantity: String(p.quantity) || 0,
          instructions: String(p.whenToTake || ""),
        })),
      };

      await assuranceAPI.addAppoinments(payload);
      alert("Appointment saved successfully!");

      setComplaintsList([]);
      setPrescribedList([]);
      setComplaint("");
      setTime("");
      setSelectedTime("");
      setComplaintSuggestions([]);
      setMedicine("");
      setDose("");
      setCustomDose("");
      setQuantity("");
      setDuration("");
      setSelectedTime1("");
      setWhenToTake("");
      setNotes("");
      setMedicineSuggestions([]);
    } catch {
      alert("Failed to save appointment");
    }
  };

  useEffect(() => {
    if (!saveClicked) return;
    saveAppointment().finally(() => setSaveClicked(false));
  }, [saveClicked]);

  // -------------------- Add / Remove --------------------
  const addComplaint = () => {
    if (!complaint) return;
    setComplaintsList([...complaintsList, { complaint, time, selectTime }]);
    setComplaint("");
    setTime("");
    setSelectedTime("");
    setComplaintSuggestions([]);
  };

  const removeComplaint = (index: number) =>
    setComplaintsList(complaintsList.filter((_, i) => i !== index));

  const addPrescription = () => {
    if (!medicine.trim()) return;

    setPrescribedList([
      ...prescribedList,
      {
        medicine,
        dose: dose === "custom" ? customDose : dose,
        quantity,
        duration,
        selectTime1,
        whenToTake,
      },
    ]);

    setMedicine("");
    setDose("");
    setCustomDose("");
    setQuantity("");
    setDuration("");
    setSelectedTime1("");
    setWhenToTake("");
    setNotes("");
    setMedicineSuggestions([]);
  };

  const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="ml-2 w-5 h-2 flex items-center justify-center  bg-red-500 text-white text-sm leading-none">
      –
    </button>
  );

  return (
    <div className="p-2 bg-white rounded-md mx-auto shadow-md">
      {/* Patient Info */}
      <div className="grid grid-cols-4 gap-2">
        <FormInput
          label="ID (Employee ID)"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <FormInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormInput
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <FormInput
          label="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <FormInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Complaints */}
      <h3 className="font-semibold text-lg mt-4 mb-2">Complaints</h3>

      <div className="grid grid-cols-4 gap-4 mb-2">
        <FormInput
          label="Complaint"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          list="complaint-suggestions"
        />

        <datalist id="complaint-suggestions">
          {complaintSuggestions.map((s, i) => (
            <option key={i} value={s} />
          ))}
        </datalist>

        <FormInput
          label="সময়"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <FormInputSelect
          label="সময়কাল"
          placeholder="সময়কাল নির্বাচন করুন"
          items={timeOptions}
          value={selectTime}
          onChange={setSelectedTime}
        />

        <div className="flex justify-start mt-6">
          <Button
            className="bg-primary px-4 py-2 text-sm"
            onClick={addComplaint}>
            Add
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2 mb-2">
        {complaintsList.map((c, i) => (
          <div
            key={i}
            className="text-xs border p-2 rounded flex items-center justify-between">
            <span>
              {c.complaint} {c.time} {c.selectTime}
            </span>
            <RemoveBtn onClick={() => removeComplaint(i)} />
          </div>
        ))}
      </div>

      {/* Prescriptions */}
      <h3 className="font-semibold text-sm mt-6 mb-2">Prescribed Medicine</h3>

      <div className="grid grid-cols-4 gap-2">
        <FormInput
          label="Medicine"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          list="medicine-list"
        />

        <datalist id="medicine-list">
          {medicineSuggestions.map((m, i) => (
            <option key={i} value={m} />
          ))}
        </datalist>

        <FormInputSelect
          label="Dose"
          placeholder="Select Dose"
          items={doseOptions}
          value={dose}
          onChange={setDose}
        />

        {dose === "custom" && (
          <FormInput
            label="Custom Dose"
            placeholder="e.g. 0+0+0"
            value={customDose}
            onChange={(e) => setCustomDose(e.target.value)}
          />
        )}

        <FormInput
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <FormInputSelect
          label="When to take"
          placeholder="সময় নির্বাচন করুন"
          items={takeTime}
          value={whenToTake}
          onChange={setWhenToTake}
        />

        <div className="flex justify-start mt-1">
          <Button className="bg-primary mt-4" onClick={addPrescription}>
            Add
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2 mb-2">
        {prescribedList.map((p, i) => (
          <div
            key={i}
            className="text-xs border p-2 rounded flex items-center justify-between">
            <span>
              {p.medicine} - {p.dose} - Qty: {p.quantity} - {p.whenToTake}
            </span>
            <RemoveBtn
              onClick={() =>
                setPrescribedList(prescribedList.filter((_, idx) => idx !== i))
              }
            />
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button className="bg-blue-600" onClick={() => setPreviewOpen(true)}>
            Preview
          </Button>

          {/* <Button
            className="bg-green-600"
            onClick={() =>
              generatePrescriptionPDF({
                id,
                name,
                department,
                complaintsList,
                prescribedList,
              })
            }
          >
            Generate PDF
          </Button> */}
        </div>

        <Button
          className="bg-purple-600 flex items-center justify-center gap-2"
          onClick={() => setSaveClicked(true)}
          disabled={saveClicked}>
          {saveClicked && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          Send
        </Button>
      </div>

      <PreviewPrescriptionModal
        open={previewOpen}
        close={() => setPreviewOpen(false)}
        id={id}
        name={name}
        department={department}
        complaintsList={complaintsList}
        prescribedList={prescribedList}
      />
    </div>
  );
};
