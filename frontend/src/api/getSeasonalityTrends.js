// src/api/getSeasonalityTrends.js

export async function getSeasonalityTrends() {
  // Mocked monthly revenue data
  return [
    { month: "Jan", revenue: 800_000_000 },
    { month: "Feb", revenue: 900_000_000 },
    { month: "Mar", revenue: 1_200_000_000 },
    { month: "Apr", revenue: 1_500_000_000 },
    { month: "May", revenue: 2_000_000_000 },
    { month: "Jun", revenue: 2_200_000_000 },
    { month: "Jul", revenue: 2_400_000_000 },
    { month: "Aug", revenue: 1_900_000_000 },
    { month: "Sep", revenue: 1_200_000_000 },
    { month: "Oct", revenue: 1_500_000_000 },
    { month: "Nov", revenue: 1_800_000_000 },
    { month: "Dec", revenue: 2_300_000_000 },
  ];
}
