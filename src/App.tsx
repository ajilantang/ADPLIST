import React, { useState } from "react";
import DatePicker, { DateValueType } from "react-tailwindcss-datepicker";
import "./App.css";
import dayjs from "dayjs";
// the calendar should allow select by 30 days
// monday 3 times slot
// tuesday have 5 time slot
// Each week have the same slot
type CalendarProps = {
  onSelectDate: (date: DateValueType) => void;
  value: DateValueType;
};
function Calendar({ onSelectDate, value }: CalendarProps) {
  // need to limitataion slect date only 30 days max
  return (
    <DatePicker
      placeholder="Please Select date"
      value={value}
      onChange={(date) => onSelectDate(date)}
    />
  );
}
type CalendarTimeSlotProps = {
  date: DateValueType;
};

const timeCalendar = {
  sunday: {
    timeSlot: [9, 10, 11, 12],

    limit: 3,
  },
  monday: {
    timeSlot: [13, 14, 15],

    limit: 3,
  },
  tuesday: {
    timeSlot: [9, 10, 11, 12, 13, 14],
    limit: 3,
  },
  wednesday: {
    timeSlot: [16, 17, 18, 19],
    limit: 2,
  },
  thursday: {
    timeSlot: [9, 10, 11, 15, 16, 17],
    limit: 1,
  },
  friday: {
    timeSlot: [9, 10, 11, 15, 16, 17],
    limit: 1,
  },
  saturday: {
    timeSlot: [9, 10, 11, 12, 13, 14, 15, 16, 17],
    limit: 1,
  },
};

type TimeCalendar = typeof timeCalendar;
const mockDataPreview: TimeCalendar = timeCalendar;
type timeCalendarKey = keyof typeof timeCalendar;
function convertDayToNumber(day: string) {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days.indexOf(day);
}

function daysOfWeekMovingForward(
  startDay: number,
  endDay: number
): Array<number> {
  if (startDay === endDay) {
    return [startDay];
  }
  return [startDay, ...daysOfWeekMovingForward(startDay + 1, endDay)];
}

function daysOfWeekMovingBackward(
  startDay: number,
  endDay: number
): Array<number> {
  if (startDay === endDay) {
    return [startDay];
  } else if (startDay === 6) {
    return [6, ...daysOfWeekMovingBackward(0, endDay)];
  }

  return [startDay, ...daysOfWeekMovingBackward(startDay + 1, endDay)];
}

function getDayOfWeek(date: DateValueType): Array<number> | null {
  const startDay = date && date.startDate && new Date(date.startDate).getDay();
  const endDay = date && date.endDate && new Date(date.endDate).getDay();

  // const rangeNumberDay = // if range of day is more than 7 days, then return all days

  if (!!startDay && !!endDay && startDay > endDay) {
    return daysOfWeekMovingBackward(startDay, endDay);
  } else if (!!startDay && !!endDay && startDay < endDay) {
    return daysOfWeekMovingForward(startDay, endDay);
  }

  return null;
}

function CalendarTimeSlot({ date }: CalendarTimeSlotProps) {
  return (
    <div className=" h-screen">
      <div className="justify-center items-center bg-white h-screen p-4 border-1 border-gray-300 rounded-md">
        {/* preview */}
        {Object.keys(mockDataPreview)
          .filter((item) => {
            return getDayOfWeek(date)?.includes(convertDayToNumber(item));
          })
          .map((item) => (
            <div
              key={item}
              className="flex flex-col  bg-blue-200 m-2 p-2 border-1 border-r-8"
            >
              <p>{item}</p>
              <p>Available Time</p>
              {timeCalendar[item as timeCalendarKey].timeSlot.map(
                (time, index) => {
                  const timeObject = timeCalendar[item as timeCalendarKey];
                  return (
                    <div key={index}>
                      <div className="flex flex-row ">
                        <p className="text-sm">
                          {time}-{Number(time) + timeObject?.limit}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
function App() {
  // need calendar component
  // need calendar time slot component
  const [value, setValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  // handle this
  // if range of day more than 30 days it just show modal cannot do that (error handler there)

  return (
    <div className="flex flex-1 flex-col justify-between">
      <Calendar value={value} onSelectDate={(date) => setValue(date)} />
      <CalendarTimeSlot date={value} />
    </div>
  );
}

export default App;
