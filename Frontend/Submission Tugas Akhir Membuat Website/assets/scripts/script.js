const yearElement = document.getElementById("year");

const getYearNow = () => {
  return new Date().getFullYear();
};

yearElement.textContent = getYearNow();

const date = new Date();
