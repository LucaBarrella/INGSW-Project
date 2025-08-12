import React from 'react';
import { Appointment } from '../../../types/agenda';
import SingleVisitCard from './cards/SingleVisitCard';
import GroupVisitCard from './cards/GroupVisitCard';

interface EventCardProps {
  appointment: Appointment;
  isConflict?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ appointment, isConflict }) => {
  const isGroupVisit = appointment.type === 'group' || (Array.isArray(appointment.client) && appointment.client.length > 1);

  if (isConflict) {
    return <SingleVisitCard appointment={appointment} isConflict={true} />;
  }
  
  if (isGroupVisit) {
    return <GroupVisitCard appointments={[appointment]} />;
  }

  return <SingleVisitCard appointment={appointment} />;
};

export default EventCard;
