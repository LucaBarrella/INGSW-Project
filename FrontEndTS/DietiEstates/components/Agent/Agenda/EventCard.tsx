import React from 'react';
import { VisitRequest } from '../../../src/dto/agenda';
import SingleVisitCard from './cards/SingleVisitCard';
import GroupVisitCard from './cards/GroupVisitCard';

interface EventCardProps {
  appointment: VisitRequest;
  isConflict?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ appointment, isConflict }) => {
  const isGroupVisit = appointment.isGroupOpportunity  || (Array.isArray(appointment.userInfo) && appointment.userInfo.length > 1);

  if (isConflict) {
    return <SingleVisitCard appointment={appointment} isConflict={true} />;
  }
  
  if (isGroupVisit) {
    return <GroupVisitCard appointments={[appointment]} />;
  }

  return <SingleVisitCard appointment={appointment} />;
};

export default EventCard;
