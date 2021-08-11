import { useState } from 'react';
import BackButton from './BackButton';

export default function BackToEvent({ eventId }: { eventId: number }) {
  const [loading, setLoading] = useState(false)

  return (
    <BackButton
      href={`/events/${eventId}`}
      value="Back to Event"
    />
  )
}