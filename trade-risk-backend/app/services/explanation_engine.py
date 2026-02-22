def generate_explanations(df):

    explanations = []

    for _, row in df.iterrows():

        parts = []

        # --- Risk Level Intro ---
        parts.append(f"Risk classified as {row['final_risk_level']}.")

        # --- AI Signal ---
        if row["ai_score"] > 80:
            parts.append(
                f"Strong statistical anomaly detected (AI score {row['ai_score']:.2f})."
            )
        elif row["ai_score"] > 60:
            parts.append(
                f"Moderate statistical deviation observed (AI score {row['ai_score']:.2f})."
            )

        # --- Rule Triggers ---
        if row["price_rule_triggered"]:
            parts.append(
                f"Significant price deviation (z-score {row['price_zscore']:.2f})."
            )

        if row["volume_rule_triggered"]:
            parts.append(
                f"Unusual trade volume (z-score {row['volume_zscore']:.2f})."
            )

        if row["route_rule_triggered"]:
            parts.append("Rare trade route identified.")

        if row["exporter_rule_triggered"]:
            parts.append("Low-frequency exporter involved.")

        # --- Context Adjustment ---
        if row["context_adjustment"] < 0:
            parts.append("Risk adjusted downward due to stable historical patterns.")

        # --- Fallback ---
        if len(parts) == 1:  # only risk intro exists
            parts.append("Transaction falls within normal behavioral thresholds.")

        explanation_text = " ".join(parts)
        explanations.append(explanation_text)

    df["explanation_text"] = explanations

    return df
