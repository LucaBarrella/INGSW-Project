import * as React from 'react';
import { useState, useCallback } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { Appointment } from '../../../types/agenda';
import SingleVisitCard from './cards/SingleVisitCard';
import GroupVisitCard from './cards/GroupVisitCard';
import ConflictBlock from './cards/ConflictBlock';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface TimelineEventProps {
  group: Appointment[];
  showTime: boolean;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({ group, showTime }) => {
  const [cardHeight, setCardHeight] = useState(0);
  const firstEvent = group[0];
  const { startTime } = firstEvent;

  const isConflict = group.length > 1 && group.some(app => app.property.id !== group[0].property.id);
  const isGroupVisit = group.length > 1 && !isConflict;
  const isSingleVisit = group.length === 1;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

    const conflictColor = useThemeColor({}, 'error');
    const groupVisitColor = useThemeColor({}, 'success');
    const singleVisitColor = useThemeColor({}, 'info');
    const borderColor = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');

    const eventStyleConfig = React.useMemo(() => {
        if (isConflict) {
            return {
                color: conflictColor,
                dotClass: 'w-4 h-4',
                shadowClass: 'shadow-lg shadow-red-500/30', // Tailwind shadow classes are hard to make dynamic with theme colors
            };
        }
        if (isGroupVisit) {
            return {
                color: groupVisitColor,
                dotClass: 'w-3.5 h-3.5',
                shadowClass: 'shadow-sm',
            };
        }
        return {
            color: singleVisitColor,
            dotClass: 'w-3 h-3',
            shadowClass: 'shadow-sm',
        };
    }, [isConflict, isGroupVisit, conflictColor, groupVisitColor, singleVisitColor]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setCardHeight(height);
  }, []);

  const renderEventCard = () => {
    if (isSingleVisit) {
      return <SingleVisitCard appointment={firstEvent} />;
    }
    if (isGroupVisit) {
      return <GroupVisitCard appointments={group} />;
    }
    return <ConflictBlock appointments={group} />;
  };


  return (
    <ThemedView className="flex-row items-start">
      {/* Colonna Timeline */}
      <ThemedView className="w-20 items-center">
        {showTime && (
          <ThemedText type="defaultSemiBold" style={{ color: textColor }} className="mb-1">{formatTime(startTime)}</ThemedText>
        )}
        <ThemedView className="items-center" style={{ height: cardHeight }}>
          {/* Puntino di inizio */}
          <ThemedView
            className={`rounded-full border-2 ${eventStyleConfig.dotClass} ${eventStyleConfig.shadowClass}`}
            style={{ borderColor: borderColor, backgroundColor: eventStyleConfig.color }}
          />
          {/* Linea verticale */}
          <ThemedView
            className={`flex-1 w-0.5`}
            style={{ backgroundColor: eventStyleConfig.color, height: cardHeight - (parseInt(eventStyleConfig.dotClass.split(' ')[1].replace('h-', '')) * 4) }}
          />
          {/* Puntino di fine */}
          <ThemedView
            className={`rounded-full border-2 ${eventStyleConfig.dotClass} ${eventStyleConfig.shadowClass}`}
            style={{ borderColor: borderColor, backgroundColor: eventStyleConfig.color }}
          />
        </ThemedView>
      </ThemedView>

      {/* Card dell'evento */}
      <ThemedView className="flex-1 ml-2 pt-16 pb-4 pr-4" onLayout={onLayout}>
        {renderEventCard()}
      </ThemedView>
    </ThemedView>
  );
};

export default TimelineEvent;
