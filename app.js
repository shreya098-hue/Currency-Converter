const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

/* Populate dropdowns */
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") option.selected = true;
    if (select.name === "to" && currCode === "INR") option.selected = true;

    select.append(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
    updateExchangeRate();
  });
}

const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }

    const URL = `${BASE_URL}/${fromCurr.value}`;
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    const rate = data.rates[toCurr.value];

    if (!rate) {
      throw new Error("Currency not supported");
    }

    const finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate";
    console.error(error.message);
  }
};

/* Update flag */
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

/* Button click */
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

/* On load */
window.addEventListener("load", updateExchangeRate);
