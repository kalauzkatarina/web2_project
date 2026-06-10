import { HiOutlineExclamationCircle } from "react-icons/hi";
import type { ConfirmationModalProps } from "../../types/props/confirmation/ConfirmationModalProps";

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="
                fixed
                inset-0
                bg-black/40
                flex
                items-center
                justify-center
                z-50
            "
        >
            <div
                className="
                    bg-white
                    rounded-[2rem]
                    p-8
                    w-full
                    max-w-md
                    shadow-xl
                "
            >
                <div className="flex justify-center mb-4">
                    <div
                        className="
                            p-4
                            rounded-full
                            bg-red-50
                            text-red-500
                        "
                    >
                        <HiOutlineExclamationCircle size={32} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center">
                    {title}
                </h2>

                <p className="text-stone-500 text-center mt-3">
                    {message}
                </p>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onCancel}
                        className="
                            flex-1
                            py-3
                            rounded-xl
                            border
                            border-stone-200
                            hover:bg-stone-50
                        "
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="
                            flex-1
                            py-3
                            rounded-xl
                            bg-red-500
                            text-white
                            hover:bg-red-600
                        "
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}