const yearElement = document.getElementById("year");

/** Fungsi Untuk Mengambil Tahun Sekarang, fungsi ini mengembalikan number */
const getYearNow = () => {
  return new Date().getFullYear();
};

yearElement.textContent = getYearNow();

const getAnime = async () => {
  const response = await fetch("data/jjk.json");
  const data = await response.json();
  console.log(data);
};

getAnime();
