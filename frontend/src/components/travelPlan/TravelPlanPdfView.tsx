import type { TravelPlanPdfProps } from "../../types/props/travelPlan/TravelPlanPdfProps";

export default function TravelPlanPdfView({ plan }: TravelPlanPdfProps) {
    const totalActivities = plan.destinations.reduce(
        (sum, d) => sum + (d.activities?.length ?? 0),
        0
    );

    const totalCost = plan.destinations.reduce(
        (sum, d) =>
            sum +
            (d.activities?.reduce(
                (activitySum, activity) =>
                    activitySum + activity.estimatedCost,
                0
            ) ?? 0),
        0
    );

    return (
        <div id="pdf-content" style={{ backgroundColor: "#ffffff", width: "794px", padding: "60px", fontFamily: "'Segoe UI', sans-serif", color: "#1f2937", lineHeight: "1.5" }}>

            <div style={{ marginBottom: "40px" }}>
                <h1 style={{ fontSize: "36px", margin: "0 0 10px 0", color: "#000" }}>{plan.title}</h1>
                <p style={{ fontSize: "16px", color: "#4b5563", margin: "0 0 20px 0" }}>{plan.description}</p>
                <div style={{ display: "flex", gap: "25px", fontSize: "13px", color: "#6b7280" }}>
                    <span>{new Date(plan.startDate).toLocaleDateString()} — {new Date(plan.endDate).toLocaleDateString()}</span>
                    <span>{plan.destinations.length} Destinations</span>
                    <span>{totalActivities} Activities</span>
                </div>
            </div>

            {plan.generalNotes && (
                <div style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", marginBottom: "40px", borderLeft: "4px solid #f59e0b" }}>
                    <p style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "12px", textTransform: "uppercase", color: "#92400e" }}>General Notes</p>
                    <p style={{ margin: 0, fontSize: "14px" }}>{plan.generalNotes}</p>
                </div>
            )}

            {plan.destinations.map((dest, index) => (
                <div key={dest.id} style={{ marginBottom: "40px", breakInside: "avoid" }}>
                    <h2 style={{ fontSize: "20px", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px" }}>
                        {index + 1}. {dest.name} <span style={{ fontSize: "14px", color: "#9ca3af", fontWeight: "normal" }}>({dest.location})</span>
                    </h2>
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px", marginBottom: "12px" }}>
                        Stay: {new Date(dest.arrivalDate).toLocaleDateString()} - {new Date(dest.departureDate).toLocaleDateString()}
                    </p>
                    {dest.description && <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "20px" }}>{dest.description}</p>}

                    {!dest.activities?.length ? (
                        <p style={{ color: "#6b7280", fontStyle: "italic" }}>No activities planned.</p>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ textAlign: "left", fontSize: "11px", color: "#9ca3af", textTransform: "uppercase" }}>
                                    <th style={{ padding: "8px 0" }}>Activity</th>
                                    <th style={{ padding: "8px 0" }}>Time</th>
                                    <th style={{ textAlign: "right", padding: "8px 0" }}>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dest.activities.map((activity) => (
                                    <tr key={activity.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                        <td style={{ padding: "12px 0" }}>
                                            <div style={{ fontWeight: "600", fontSize: "14px" }}>{activity.title}</div>
                                            {activity.description && <div style={{ fontSize: "12px", color: "#6b7280" }}>{activity.description}</div>}
                                        </td>
                                        <td style={{ fontSize: "13px", color: "#4b5563" }}>{new Date(activity.date).toLocaleDateString()}, {activity.time}</td>
                                        <td style={{ textAlign: "right", fontWeight: "600" }}>€{activity.estimatedCost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ))}

            <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "2px solid #1f2937" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
                    <span>Total Planned Budget:</span>
                    <span>€{plan.plannedBudget}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", color: "#6b7280" }}>
                   <span>Planned Activity Costs:</span>
                    <span>€{totalCost}</span>
                </div>
            </div>

            <div style={{ marginTop: "40px", paddingTop: "15px", borderTop: "1px solid #e5e7eb", textAlign: "center", color: "#9ca3af", fontSize: "12px" }}>
                Generated by Travel Planner • {new Date().toLocaleDateString()}
            </div>
        </div>
    );
}