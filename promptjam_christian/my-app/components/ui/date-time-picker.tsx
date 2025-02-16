import React, { useState } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment, { Moment } from 'moment';

interface DateTimePickerProps {
  label: string;
  onDateChange: (date: string) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  onDateChange
}) => {
  const [selectedDate, setSelectedDate] = useState<string | Moment>('');

  const handleDateChange = (date: string | Moment) => {
    setSelectedDate(date);
    if (moment.isMoment(date)) {
      onDateChange(date.format('YYYY-MM-DD HH:mm'));
    }
  };

  return (
    <div className="my-4 mt-6 w-full">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <div className="relative">
        <Datetime
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full rounded-lg text-black focus:ring-primary dark:text-gray-700"
          inputProps={{
            className:
              'w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white',
            placeholder: 'Select date and time'
          }}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
