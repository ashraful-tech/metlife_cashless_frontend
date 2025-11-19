import { FC, ReactNode } from "react";

interface PropsType {
  onOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const ReusableModal: FC<PropsType> = ({ onOpen, onClose, children }) => {
  if (!onOpen) return null; // clean early return

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 fade-in">
      <div
        className="absolute inset-0 bg-black/70 opacity-75"
        onClick={onClose}></div>
      <div className="z-10">{children}</div>
    </div>
  );
};
