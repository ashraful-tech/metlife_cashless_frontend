import { updateURLSearchParams } from "@/utils/helpers/url.helpers";
import { ParsedUrlQuery } from "querystring";
import { BaseAPI } from "./baseAPI";
import { BR } from "./interface";
import {
  IAllAppointmentData,
  IAuth,
  IPolicyResponse,
  SignInPayload,
  UserData,
} from "./interface/assuarace";

class AssuranceAPI extends BaseAPI {
  constructor(baseURL: string) {
    super(baseURL);
  }

  getAppointmentData = (query: ParsedUrlQuery) => {
    let optionalParams: any = {};
    if (!query?.page) optionalParams["page"] = "1";
    const params = updateURLSearchParams(query, optionalParams);

    return this.get<BR<IAllAppointmentData>>(`appointments?${params}`);
  };

  /** Fetch single appointment by employeeId */
  getAppointmentById = (employeeId: string) => {
    if (!employeeId) throw new Error("employeeId is required");
    return this.get<BR<IAllAppointmentData>>(
      `appointments/employee/${employeeId}`
    );
  };

  updateAppoinmnetList = (id: string, payload: any) => {
    return this.patch<BR<IAllAppointmentData>>(`appointments/${id}`, payload);
  };

  updateMedicalStatus = (id: string, payload: any) => {
    return this.patch<BR<IAllAppointmentData>>(`appointments/${id}`, payload);
  };
  uploadDocuments = (id: string, payload: any) => {
    return this.patch<BR<IAllAppointmentData>>(`appointments/${id}`, payload);
  };
  addBancassurance = (payload: any) => {
    return this.post<BR<IPolicyResponse>>(`appointments`, payload);
  };

  addBancassuranceByCSV = (payload: any) => {
    return this.post<BR<IPolicyResponse>>(
      `appointments/by-json-upload`,
      payload
    );
  };
  sendSms = (id: string) => {
    return this.get<BR<IAllAppointmentData>>(
      `appointments/send-sms-for-appointment/${id}`
    );
  };
  getUserInfo = () => {
    return this.post<BR<UserData>>(`auth/profile`, {});
  };

  signInUser = (payload: SignInPayload) =>
    this.post<BR<IAuth>>("auth/login", payload);

  uploadImage = (payload: any) => this.image<BR<any>>(`upload/pdf`, payload);

  getExportData = (query: ParsedUrlQuery) => {
    let optionalParams: any = {};
    const params = updateURLSearchParams(query, optionalParams);

    return this.get(`appointments/export`);
  };
}

export const assuranceAPI = new AssuranceAPI(
  process.env.METLIFE_CASHLESS_SERVICE as string
);
