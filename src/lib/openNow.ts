/**
 * Check if restaurant is open now based on opening hours
 * Opening hours format: "Mon-Fri: 09:00-22:00, Sat-Sun: 10:00-23:00"
 */
export function isOpenNow(openingHours: string | null): boolean {
  if (!openingHours) return false;

  try {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight

    // Parse opening hours
    const parts = openingHours.split(",");

    for (const part of parts) {
      const [days, hours] = part.split(":").map((s) => s.trim());
      if (!days || !hours) continue;

      // Check if current day matches
      if (isDayMatch(days, currentDay)) {
        // Check if current time is within hours
        const [openTime, closeTime] = hours.split("-");
        const openMinutes = parseTime(openTime);
        const closeMinutes = parseTime(closeTime);

        if (
          openMinutes !== null &&
          closeMinutes !== null &&
          currentTime >= openMinutes &&
          currentTime <= closeMinutes
        ) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Error parsing opening hours:", error);
    return false;
  }
}

function isDayMatch(dayPattern: string, currentDay: number): boolean {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDayName = dayNames[currentDay];

  // Handle ranges like "Mon-Fri"
  if (dayPattern.includes("-")) {
    const [start, end] = dayPattern.split("-").map((s) => s.trim());
    const startIdx = dayNames.indexOf(start);
    const endIdx = dayNames.indexOf(end);

    if (startIdx === -1 || endIdx === -1) return false;

    if (startIdx <= endIdx) {
      return currentDay >= startIdx && currentDay <= endIdx;
    } else {
      // Wrap around (e.g., Sat-Mon)
      return currentDay >= startIdx || currentDay <= endIdx;
    }
  }

  // Handle single day or comma-separated days
  const days = dayPattern.split("/").map((s) => s.trim());
  return days.includes(currentDayName);
}

function parseTime(timeStr: string): number | null {
  try {
    const [hours, minutes] = timeStr.trim().split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return hours * 60 + minutes;
  } catch {
    return null;
  }
}

export function getOpenStatus(openingHours: string | null): {
  isOpen: boolean;
  label: string;
  color: string;
} {
  const isOpen = isOpenNow(openingHours);
  return {
    isOpen,
    label: isOpen ? "Open Now" : "Closed",
    color: isOpen ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50",
  };
}
