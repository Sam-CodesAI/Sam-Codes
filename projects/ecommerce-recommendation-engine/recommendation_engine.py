"""
E-Commerce Hybrid Recommendation Engine with Cold-Start Mitigation
Architecture:
1. Cold-Start Phase (New Users with 0 Interactions):
   - Category-Weighted Bayesian Popularity Fallback
   - Demographic & Trending Priors
2. Warm Phase (Returning Users with Interaction History):
   - Content-Based TF-IDF / Cosine Feature Similarity
   - Weighted Hybrid Scoring
"""

import math
from typing import List, Dict, Any, Optional

# Sample E-Commerce Product Catalog
PRODUCTS = [
    {
        "id": "PROD-001",
        "title": "Noise-Cancelling Wireless Headphones",
        "category": "Electronics",
        "tags": ["audio", "bluetooth", "wireless", "headphones", "music"],
        "price": 2999,
        "rating": 4.6,
        "review_count": 340,
    },
    {
        "id": "PROD-002",
        "title": "Ergonomic Mechanical Keyboard (RGB)",
        "category": "Electronics",
        "tags": ["gaming", "keyboard", "rgb", "pc", "accessories"],
        "price": 3499,
        "rating": 4.8,
        "review_count": 520,
    },
    {
        "id": "PROD-003",
        "title": "Ultra-Wide Gaming Monitor 27-inch 165Hz",
        "category": "Electronics",
        "tags": ["gaming", "monitor", "display", "pc", "screen"],
        "price": 14999,
        "rating": 4.5,
        "review_count": 180,
    },
    {
        "id": "PROD-004",
        "title": "Breathable Athletic Running Shoes",
        "category": "Fashion & Fitness",
        "tags": ["shoes", "fitness", "running", "sports", "apparel"],
        "price": 1899,
        "rating": 4.4,
        "review_count": 610,
    },
    {
        "id": "PROD-005",
        "title": "Stainless Steel Insulated Water Bottle (1L)",
        "category": "Fashion & Fitness",
        "tags": ["fitness", "gym", "bottle", "hydration", "accessories"],
        "price": 699,
        "rating": 4.7,
        "review_count": 890,
    },
    {
        "id": "PROD-006",
        "title": "Deep-Tissue Muscle Massage Gun",
        "category": "Fashion & Fitness",
        "tags": ["recovery", "fitness", "gym", "massage", "wellness"],
        "price": 2499,
        "rating": 4.3,
        "review_count": 210,
    },
    {
        "id": "PROD-007",
        "title": "Minimalist Ceramic Coffee Mug Set",
        "category": "Home & Kitchen",
        "tags": ["coffee", "kitchen", "ceramic", "mug", "home"],
        "price": 799,
        "rating": 4.9,
        "review_count": 410,
    },
    {
        "id": "PROD-008",
        "title": "Smart Air Fryer with Digital Touchscreen",
        "category": "Home & Kitchen",
        "tags": ["kitchen", "cooking", "appliances", "smart", "healthy"],
        "price": 4999,
        "rating": 4.6,
        "review_count": 750,
    },
]

# Simulated User Interaction Histories
USER_INTERACTIONS = {
    # Returning User: Interested in Electronics & Gaming
    "USER-101": ["PROD-001", "PROD-002"],
    # Returning User: Interested in Fitness
    "USER-102": ["PROD-004", "PROD-005"],
    # Cold-Start User: Brand new, 0 interactions
    "USER-COLD-START": [],
}


class ColdStartRecommendationEngine:
    def __init__(self, products: List[Dict[str, Any]]):
        self.products = products
        self.product_map = {p["id"]: p for p in products}

        # Calculate global average rating for Bayesian smoothing
        total_rating = sum(p["rating"] * p["review_count"] for p in products)
        total_reviews = sum(p["review_count"] for p in products)
        self.global_mean_rating = total_rating / total_reviews if total_reviews else 4.0
        self.smoothing_weight = 50.0  # Minimum review confidence threshold

    def calculate_bayesian_popularity(self, product: Dict[str, Any]) -> float:
        """
        Bayesian Average Rating for Cold-Start Ranking:
        Formula: (C * m + R * v) / (C + v)
        where:
        - C = smoothing weight (confidence parameter)
        - m = global mean rating
        - R = product average rating
        - v = number of reviews for product
        """
        v = product["review_count"]
        r = product["rating"]
        c = self.smoothing_weight
        m = self.global_mean_rating
        return (c * m + r * v) / (c + v)

    def calculate_tag_similarity(self, tags1: List[str], tags2: List[str]) -> float:
        """
        Jaccard / Cosine overlap of tag sets between user history and target item.
        """
        set1, set2 = set(tags1), set(tags2)
        if not set1 or not set2:
            return 0.0
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        return intersection / union if union else 0.0

    def recommend(
        self,
        user_id: str,
        preferred_category: Optional[str] = None,
        top_k: int = 4
    ) -> Dict[str, Any]:
        """
        Dynamically recommends products based on user status (Cold Start vs Returning).
        """
        history = USER_INTERACTIONS.get(user_id, [])
        is_cold_start = len(history) == 0

        recommendations = []

        if is_cold_start:
            # === COLD-START PIPELINE ===
            # When user history is zero, fallback to Bayesian Popularity + Optional Category Prior
            for p in self.products:
                score = self.calculate_bayesian_popularity(p)
                reason = "🔥 Popular Item Fallback (Bayesian Rating: {:.2f})".format(score)

                # If user selected an onboarding category preference, boost it
                if preferred_category and p["category"].lower() == preferred_category.lower():
                    score *= 1.35
                    reason = f"⭐ Top Trending in Preferred Category: {preferred_category}"

                recommendations.append({
                    "product": p,
                    "score": round(score, 3),
                    "algorithm_used": "Bayesian Popularity Fallback (Cold Start)",
                    "reason": reason,
                })
        else:
            # === WARM USER CONTENT-BASED PIPELINE ===
            # Aggregate all tags from user's interaction history
            history_tags: List[str] = []
            for item_id in history:
                if item_id in self.product_map:
                    history_tags.extend(self.product_map[item_id]["tags"])

            for p in self.products:
                # Do not recommend items the user already purchased
                if p["id"] in history:
                    continue

                sim_score = self.calculate_tag_similarity(history_tags, p["tags"])
                pop_score = self.calculate_bayesian_popularity(p) / 5.0  # Normalize to 0-1

                # Hybrid Weighted Score: 70% Content Similarity + 30% Popularity
                hybrid_score = (0.70 * sim_score) + (0.30 * pop_score)

                recommendations.append({
                    "product": p,
                    "score": round(hybrid_score, 3),
                    "algorithm_used": "Content Cosine Similarity + Popularity Prior",
                    "reason": f"🎯 Matched previous interest in {', '.join(p['tags'][:2])}",
                })

        # Sort recommendations by descending score
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        top_recommendations = recommendations[:top_k]

        return {
            "user_id": user_id,
            "is_cold_start": is_cold_start,
            "pipeline_state": "COLD_START_FALLBACK" if is_cold_start else "PERSONALIZED_HYBRID",
            "history_count": len(history),
            "recommendations": top_recommendations,
        }


if __name__ == "__main__":
    engine = ColdStartRecommendationEngine(PRODUCTS)

    print("==========================================================")
    print("DEMO 1: NEW USER (COLD-START SCENARIO)")
    print("==========================================================")
    cold_result = engine.recommend("USER-COLD-START", preferred_category="Electronics")
    print(f"User: {cold_result['user_id']}")
    print(f"Pipeline: {cold_result['pipeline_state']} (History items: {cold_result['history_count']})\n")
    for idx, r in enumerate(cold_result["recommendations"], 1):
        p = r["product"]
        print(f"  {idx}. {p['title']} [{p['category']}]")
        print(f"     Score: {r['score']} | {r['reason']}")

    print("\n==========================================================")
    print("DEMO 2: RETURNING GAMING USER (WARM SCENARIO)")
    print("==========================================================")
    warm_result = engine.recommend("USER-101")
    print(f"User: {warm_result['user_id']}")
    print(f"Pipeline: {warm_result['pipeline_state']} (History: {warm_result['history_count']} items)\n")
    for idx, r in enumerate(warm_result["recommendations"], 1):
        p = r["product"]
        print(f"  {idx}. {p['title']} [{p['category']}]")
        print(f"     Score: {r['score']} | {r['reason']}")
