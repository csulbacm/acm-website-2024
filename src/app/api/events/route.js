import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

let events = [
  {
    id: uuidv4(),
    title: 'Networking Event',
    startDate: '2024-10-25T10:00:00',
    endDate: '2024-10-25T12:00:00',
    allDay: false,
    description: 'Join us for a networking event to connect with industry professionals.',
    image: '/images/arnav.jpeg',
  },
  {
    id: uuidv4(),
    title: 'React Workshop',
    startDate: '2024-10-27T14:00:00',
    endDate: '2024-10-27T16:00:00',
    allDay: false,
    description: 'Learn the basics of React in this hands-on workshop.',
    image: '/images/react-workshop.jpg',
  },
  {
    id: uuidv4(),
    title: 'Hackathon',
    startDate: '2024-11-01T09:00:00',
    endDate: '2024-11-02T17:00:00',
    allDay: false,
    description: 'Participate in our hackathon to solve real-world problems and win prizes.',
    image: '/images/hackathon.jpg',
  },
  {
    id: uuidv4(),
    title: 'Python Bootcamp',
    startDate: '2024-11-05T10:00:00',
    endDate: '2024-11-05T15:00:00',
    allDay: false,
    description: 'A comprehensive Python bootcamp for beginners.',
    image: '/images/python-bootcamp.jpg',
  },
  {
    id: uuidv4(),
    title: 'AI Seminar',
    startDate: '2024-11-10T13:00:00',
    endDate: '2024-11-10T15:00:00',
    allDay: false,
    description: 'Discover the latest advancements in AI and machine learning.',
    image: '/images/ai-seminar.jpg',
  },
  {
    id: uuidv4(),
    title: 'JavaScript Deep Dive',
    startDate: '2024-11-15T10:00:00',
    endDate: '2024-11-15T12:00:00',
    allDay: false,
    description: 'A deep dive into JavaScript for intermediate developers.',
    image: '/images/js-deep-dive.jpg',
  },
  {
    id: uuidv4(),
    title: 'Career Fair',
    startDate: '2024-11-20T09:00:00',
    endDate: '2024-11-20T17:00:00',
    allDay: false,
    description: 'Meet potential employers and learn about career opportunities.',
    image: '/images/career-fair.jpg',
  },
  {
    id: uuidv4(),
    title: 'Cloud Computing Workshop',
    startDate: '2024-11-25T14:00:00',
    endDate: '2024-11-25T17:00:00',
    allDay: false,
    description: 'Learn about cloud computing and how to use AWS.',
    image: '/images/cloud-computing.jpg',
  },
  {
    id: uuidv4(),
    title: 'Cybersecurity Awareness',
    startDate: '2024-11-30T10:00:00',
    endDate: '2024-11-30T12:00:00',
    allDay: false,
    description: 'Learn how to protect yourself online with cybersecurity best practices.',
    image: '/images/cybersecurity.jpg',
  },
  {
    id: uuidv4(),
    title: 'Data Science Meetup',
    startDate: '2024-12-05T13:00:00',
    endDate: '2024-12-05T15:00:00',
    allDay: false,
    description: 'Meet other data science enthusiasts and share knowledge.',
    image: '/images/data-science.jpg',
  },
  {
    id: uuidv4(),
    title: 'Blockchain Basics',
    startDate: '2024-12-10T11:00:00',
    endDate: '2024-12-10T13:00:00',
    allDay: false,
    description: 'An introduction to blockchain technology and its applications.',
    image: '/images/blockchain.jpg',
  },
  {
    id: uuidv4(),
    title: 'Full Stack Development Workshop',
    startDate: '2024-12-15T10:00:00',
    endDate: '2024-12-15T17:00:00',
    allDay: false,
    description: 'A full-day workshop on full stack development.',
    image: '/images/full-stack.jpg',
  },
];

export async function GET() {
  return NextResponse.json(events);
}

export async function POST(req) {
  const newEvent = await req.json();
  newEvent.id = uuidv4();
  events.push(newEvent);
  return NextResponse.json(newEvent, { status: 201 });
}
