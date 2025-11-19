export interface SidebarItem {
  title: string;
  path: string;
  roles?: string[];
}

export interface SidebarType {
  type: string;
  item: SidebarItem[];
}

export const sidebarItems: SidebarType[] = [
  {
    type: "CallCenter",
    item: [
      // {
      // 	title: "Dashboard",
      // 	path: "/",
      // },
      // {
      // 	title: "Appointment Booking",
      // 	path: "/appoinment",
      // },
    ],
  },
  {
    type: "Doctor",
    item: [
      {
        title: "All Appointments",
        path: "/medical-assessment",
      },
      {
        title: "Medical Appointments",
        path: "/medical-appoinments",
      },
    ],
  },
  {
    type: "Business",
    item: [
      // {
      // 	title: "User list",
      // 	path: "/business-team",
      // },
    ],
  },
  {
    type: "Metlife",
    item: [
      // {
      // 	title: "User list",
      // 	path: "/metlife",
      // },
    ],
  },
  {
    type: "Metlife",
    item: [
      // {
      // 	title: "User list",
      // 	path: "/metlife",
      // },
    ],
  },
];
