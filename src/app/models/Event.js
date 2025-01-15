import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  allDay: { type: Boolean, default: false },
  location: { type: String, required: true },
  image: String,
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
