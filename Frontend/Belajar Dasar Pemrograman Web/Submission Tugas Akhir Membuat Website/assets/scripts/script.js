const yearElement = document.getElementById("year");

const getYearNow = () => {
  return new Date().getFullYear();
};

yearElement.textContent = getYearNow();

const clockElement = document.getElementById("clock");
setInterval(() => {
  const date = new Date();
  const minute = date.getMinutes();
  const hour = date.getHours();
  const seconds = date.getSeconds();

  const formatDate = (h, m, s) => {
    if (h < 10) {
      h = `0${h}`;
    }
    if (m < 10) {
      m = `0${m}`;
    }
    if (s < 10) {
      s = `0${s}`;
    }
    return `${h}:${m}:${s}`;
  };
  clockElement.textContent = formatDate(hour, minute, seconds);
}, 1000);
