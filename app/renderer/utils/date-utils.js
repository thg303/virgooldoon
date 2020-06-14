import moment from 'moment-jalaali';

const convertNumbersToEn = function (string) {
  const numberMap = {
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
    '۰': '0'
  };
  
  return string.replace(/[۰-۹]/g, function (match) {
    return numberMap[match]
  }).replace(/،/g, ',');
};

const durations = {};
durations['سال'] = { key: 'y', value: 'years' };
durations['ماه'] = { key: 'M', value: 'months' };
durations['هفته'] = { key: 'w', value: 'weeks' };
durations['روز'] = { key: 'd', value: 'days' };
durations['ساعت'] = { key: 'h', value: 'hours' };
durations['دقیقه'] = { key: 'm', value: 'minutes' };
durations['ثانیه'] = { key: 's', value: 'seconds' };
durations['میلی ثانیه'] = { key: 'ms', value: 'milliseconds' };

function getNumbers(string) {
  return string.filter(function(w) {
    return w.match(/\d+/);
  })
}

const buildDurationObject = (duration) => {
  const englishNumberDuration = convertNumbersToEn(duration);
  if (englishNumberDuration.includes('چند ثانیه')) {
    return { diff: 1, key: 's', value: 'seconds'}
  }
  const number = parseInt(englishNumberDuration.match(/\d+/g)[0], 10);
  const regex = /(سال|ماه|هفته|روز|ساعت|دقیقه|ثانیه|میلی ثانیه)/;
  const found = englishNumberDuration.match(regex);
  if (found) {
    return { diff: number, ...durations[found[0]] };
  }
  return null;
}

export function buildTimeDiffFromDuration(duration) {
  const durationObject = buildDurationObject(duration);
  if (!durationObject) {
    return null;
  }
  const d = moment.duration(durationObject.diff, durationObject.key);
  const now = moment();
  return now.subtract(d.get(durationObject.value), durationObject.value);
}