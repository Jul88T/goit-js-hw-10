import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const datetimePicker = flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userSelectedDate = selectedDates[0];
    const startBtn = document.querySelector('#start-btn');
    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
});

const startBtn = document.querySelector('#start-btn');
const timerFields = document.querySelectorAll('.timer .value');
let countdownInterval;
let selectedDate = null;

function startTimer() {
  selectedDate = datetimePicker.selectedDates[0];
  startBtn.disabled = true;
  document.querySelector('#datetime-picker').disabled = true;

  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const remainingTime = selectedDate - currentTime;

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      timerFields.forEach(field => (field.textContent = '00'));
    } else {
      const { days, hours, minutes, seconds } = convertMs(remainingTime);
      timerFields[0].textContent = addLeadingZero(days);
      timerFields[1].textContent = addLeadingZero(hours);
      timerFields[2].textContent = addLeadingZero(minutes);
      timerFields[3].textContent = addLeadingZero(seconds);
    }
  }, 1000);
}

startBtn.addEventListener('click', startTimer);
