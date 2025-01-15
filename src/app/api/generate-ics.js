import moment from "moment-timezone";

export default function handler(req, res) {
  const { title, start, end, description, location } = req.query;

  if (!title || !start || !end || !location) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  // Convert to UTC format
  const startUtc = moment.tz(start, "America/Los_Angeles").utc().format("YYYYMMDDTHHmmss[Z]");
  const endUtc = moment.tz(end, "America/Los_Angeles").utc().format("YYYYMMDDTHHmmss[Z]");

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your App//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description || ""}
LOCATION:${location}
DTSTART:${startUtc}
DTEND:${endUtc}
END:VEVENT
END:VCALENDAR`;

  res.setHeader("Content-Type", "text/calendar");
  res.setHeader("Content-Disposition", `attachment; filename="${title.replace(/\s+/g, "_")}.ics"`);
  res.status(200).send(icsContent);
}
