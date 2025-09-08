import { createPortal } from "react-dom";
import { useToast } from "../contexts/ToastContext";
import Toast from "./Toast";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed top-4 right-4 z-[10000] space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;