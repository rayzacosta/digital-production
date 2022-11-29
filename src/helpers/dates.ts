import moment from 'moment';

export const getDuration = (
  startDate: string | Date,
  endDate: string | Date
) => {
  try {
    const diffTime = moment(endDate).diff(moment(startDate));

    const duration = moment.duration(diffTime);

    const days = duration.days(),
      hrs = duration.hours(),
      mins = duration.minutes(),
      secs = duration.seconds();

    const formatted = `${hrs} horas ${mins} minutos e ${secs} segundos`;

    return {
      days,
      hrs,
      mins,
      secs,
      formatted,
    };
  } catch (error) {
    return {
      days: null,
      hrs: null,
      mins: null,
      secs: null,
      formatted: null,
    };
  }
};

export const getCurrentDate = () => {
  return moment().format();
};
