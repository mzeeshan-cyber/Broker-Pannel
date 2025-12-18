export function convertToMinutes(timeString) {
  let hours = 0;
  let minutes = 0;

  const hourMatch = timeString?.match(/(\d+)\s*hour/);
  if (hourMatch) {
    hours = parseInt(hourMatch[1], 10);
  }

  const minuteMatch = timeString?.match(/(\d+)\s*min/);
  if (minuteMatch) {
    minutes = parseInt(minuteMatch[1], 10);
  }

  return (hours * 60) + minutes;
}

export function getStartTime(appointmentTime, duration) {
  let [hours, minutes] = appointmentTime?.split(":")?.map(Number);

  let totalMinutes = 0;
  const hourMatch = duration.match(/(\d+)\s*hour/);
  const minMatch = duration.match(/(\d+)\s*min/);

  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1], 10) * 60;
  }
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1], 10);
  }

  let appointmentTotalMinutes = hours * 60 + minutes;

  let startMinutes = appointmentTotalMinutes - totalMinutes;

  if (startMinutes < 0) startMinutes += 24 * 60;

  const startHours = String(Math.floor(startMinutes / 60)).padStart(2, "0");
  const startMins = String(startMinutes % 60).padStart(2, "0");
  return `${startHours}:${startMins}`;
}

export function calculateEndTime(start, duration) {
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [durationHours, durationMinutes] = duration.split(':').map(Number);

  const startTotalMins = startHours * 60 + startMinutes;
  const durationTotalMins = durationHours * 60 + durationMinutes;
  const endTotalMins = (startTotalMins + durationTotalMins) % (24 * 60); // wrap around 24 hours

  const endHours = Math.floor(endTotalMins / 60);
  const endMinutes = endTotalMins % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

export function convertMinutesToHHMM(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60) % 24; // 830 ÷ 60 = 13
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function getAllowanceAvailability({ startTime, endTime, duration }) {
  // console.log(startTime, endTime, duration)
  const enabled = {
    allowance_breakfast: false,
    allowance_lunch: false,
    allowance_dinner: false,
    allowance_lodging: false,
  };

  // If trip is >= 24 hours → full allowance
  if (duration >= 1440) {
    return {
      allowance_breakfast: true,
      allowance_lunch: true,
      allowance_dinner: true,
      allowance_lodging: true,
    };
  }

  // Same-day / Overnight handling
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);

  // Breakfast (before or at 6:00)
  if (startMins <= timeToMinutes("06:00")) {
    enabled.allowance_breakfast = true;
  }

  // Lunch (11:30 - 13:30 window covered)
  if (startTime && endTime) {
    const lunchStart = timeToMinutes("11:30");
    const lunchEnd = timeToMinutes("13:30");

    if ((startMins < lunchStart && endMins > lunchEnd) || duration >= 300) {
      enabled.allowance_lunch = true;
    }
  }

  // Dinner (after 18:30 or overnight trip)
  const dinnerCutoff = timeToMinutes("18:30");
  const endsAfterDinner = endMins >= dinnerCutoff;
  const isOvernight = endMins < startMins;

  if (startMins < dinnerCutoff && (endsAfterDinner || isOvernight)) {
    enabled.allowance_dinner = true;
  }

  // Lodging (trip crosses midnight or very long)
  if (
    (isOvernight || duration >= 480) && // Overnight or ≥ 8 hours
    timeToMinutes(endTime) > timeToMinutes("21:00") && // End time after 13:00
    timeToMinutes(startTime) < timeToMinutes("5:00")
  ) {
    enabled.allowance_lodging = true;
  }

  return enabled;
}
