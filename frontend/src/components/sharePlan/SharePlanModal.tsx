import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useShareToken } from "../../hooks/shareToken/useShareToken";
import type { SharePlanModalProps } from "../../types/props/sharePlan/SharePlanModalProps";
import { AccessType } from "../../enums/AccessType";


export default function SharePlanModal({
    isOpen,
    planId,
    onClose
}: SharePlanModalProps) {

    const { loading, shareData, createShareToken } = useShareToken();

    const fullShareUrl = shareData
        ? `${import.meta.env.VITE_FRONTEND_URL}/shared/${shareData.token}`
        : "";

    const [email, setEmail] = useState("");
    const [daysValid, setDaysValid] = useState(0);
    const [accessType, setAccessType] = useState<0 | 1>(AccessType.View);

    if (!isOpen)
        return null;

    const handleGenerate = async () => {

        await createShareToken(
            {
                planId,
                accessType,
                daysValid
            },
            email || undefined
        );
    };

    const copyLink = async () => {

        if (!shareData)
            return;

        await navigator.clipboard.writeText(
            fullShareUrl
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className={`
                    bg-white
                    rounded-[2rem]
                    p-8
                    w-full
                    shadow-xl
                    ${shareData ? "max-w-4xl" : "max-w-lg"}
                `}>

                <h2 className="text-3xl font-bold text-stone-900 mb-6">
                    Share Travel Plan
                </h2>

                <p className="text-stone-500 mb-6">
                    Generate a secure link or send it directly by email.
                </p>

                <div className="space-y-4">

                    <div>
                        <label className="form-label">
                            Email (optional)
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@gmail.com"
                            className="form-input"
                        />
                    </div>

                    <div>
                        <label className="form-label">
                            Access Type
                        </label>

                        <select
                            value={accessType}
                            onChange={(e) =>
                                setAccessType(Number(e.target.value) as 0 | 1)
                            }
                            className="form-input"
                        >
                            <option value={AccessType.View}>
                                View only
                            </option>

                            <option value={AccessType.Edit}>
                                Edit access
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="form-label">
                            Valid for (days)
                        </label>

                        <input
                            type="number"
                            min={1}
                            placeholder="1"
                            value={daysValid || ""}
                            onChange={(e) =>
                                setDaysValid(Number(e.target.value))
                            }
                            className="form-input"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading
                            ? "Generating..."
                            : "Generate Share Link"}
                    </button>
                </div>

                {shareData && (
                    <div className="mt-8 border-t border-stone-200 pt-6">

                        <div className="grid md:grid-cols-2 gap-8">

                            <div>
                                <label className="form-label">
                                    Share Link
                                </label>

                                <input
                                    readOnly
                                    value={fullShareUrl}
                                    className="form-input"
                                />

                                <button
                                    onClick={copyLink}
                                    className="
                                        mt-3
                                        w-full
                                        py-3
                                        rounded-2xl
                                        border
                                        border-stone-200
                                        hover:bg-stone-50
                                        transition
                                    "
                                >
                                    Copy Link
                                </button>

                                {shareData.expiresAt && (
                                    <p className="text-sm text-stone-500 mt-4">
                                        Expires:
                                        {" "}
                                        {new Date(
                                            shareData.expiresAt
                                        ).toLocaleString()}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <QRCodeCanvas
                                    value={fullShareUrl}
                                    size={220}
                                />

                                <p className="text-sm text-stone-500 mt-4 text-center">
                                    Scan to open the travel plan
                                </p>
                            </div>

                        </div>

                    </div>
                )}
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 border rounded-xl border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                >
                    Close
                </button>

            </div>

        </div>
    );
}