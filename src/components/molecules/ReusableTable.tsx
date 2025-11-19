import { FC } from "react";
import { TableLoader } from "./TableLoader";

interface PropsType {
  data: any;
  tableHeader: string[];
  isLoading: boolean;
  children: any;
}

export const ReusableTable: FC<PropsType> = ({
  tableHeader,
  data,
  isLoading,
  children,
}) => {
  return (
    <div className="overflow-x-auto custom-scrollbar relative">
      {/* This wrapper controls vertical scroll */}
      <div className="overflow-auto custom-scrollbar h-[70vh] lg:h-[70vh] xl:h-[80vh]2xl:h-[90vh] relative mt-5">
        <table className="w-full min-w-max table-auto text-left text-center border-collapse">
          <thead>
            <tr>
              {tableHeader?.map((head, index) => (
                <th
                  key={head}
                  className={`sticky top-0 absolute border-b border-border-gray-100 p-3 break-words text-xs font-medium bg-white
        ${
          index === 0
            ? "left-0 z-10" // first column header
            : "z-0"
        } // other headers
      `}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <TableLoader rowNumber={5} cellNumber={tableHeader?.length} />
            ) : data?.length > 0 ? (
              children
            ) : (
              <tr>
                <td colSpan={tableHeader.length} className="h-[60vh]">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center text-gray-500">No Data Found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
