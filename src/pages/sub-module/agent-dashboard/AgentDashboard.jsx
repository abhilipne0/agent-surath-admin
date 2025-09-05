import React from "react";

function AgentDashboard() {
    const stored = localStorage.getItem("agent");
    const agentInfo = stored ? JSON.parse(stored) : null;

    if (!agentInfo) return <p className="text-center mt-5">No agent info found</p>;

    const cardStyle =
        "card text-white shadow-lg border-0 rounded-4 transition-transform"; // added hover effect
    const cardBodyStyle =
        "card-body d-flex flex-column justify-content-center align-items-center";

    const cards = [
        {
            title: "Total Balance",
            value: agentInfo.coins_balance,
            subtitle: `${agentInfo.coin_percentage}%`,
            bg: "linear-gradient(135deg, #0d6efd, #6f42c1)",
        },
        {
            title: "All Users",
            value: agentInfo.totalUsers,
            bg: "linear-gradient(135deg, #ffc107, #fd7e14)",
        },
        {
            title: "Total User Balance",
            value: agentInfo.totalAvailableBalance,
            bg: "linear-gradient(135deg, #dc3545, #ff6b6b)",
        },
        {
            title: "Agent Info",
            value: `${agentInfo.name}`,
            details: [
                { label: "Mobile", value: agentInfo.mobile },
                { label: "Location", value: agentInfo.location },
            ],
            bg: "linear-gradient(135deg, #198754, #20c997)",
        },
    ];

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">Agent Dashboard</h2>
            <div className="row g-4">
                {cards.map((card, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-3">
                        <div
                            className={cardStyle}
                            style={{
                                background: card.bg,
                                cursor: "pointer",
                                transition: "transform 0.3s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <div className={cardBodyStyle}>
                                <h5 className="card-title">{card.title}</h5>
                                <p className="card-text display-6">{card.value}</p>
                                {card.subtitle && <p className="text-light">{card.subtitle}</p>}
                                {card.details &&
                                    card.details.map((d, i) => (
                                        <p className="mb-0" key={i}>
                                            <strong>{d.label}:</strong> {d.value}
                                        </p>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AgentDashboard;
