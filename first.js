const BASE_URL = "https://open.er-api.com/v6/latest";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const updated = document.querySelector(".updated");
const swapBtn = document.querySelector(".swap i");
// Populate Dropdowns
for (let select of dropdowns) {
for (let currCode in countryList) {
let option = document.createElement("option");
option.value = currCode;
option.innerText = currCode;
if (select.name === "from" && currCode === "USD") {
option.selected = true;
}
if (select.name === "to" && currCode === "INR") {
option.selected = true;
}
select.append(option);
}
select.addEventListener("change", (e) => {
updateFlag(e.target);
updateExchangeRate();
});
}
// Update Flag
function updateFlag(element) {
const countryCode = countryList[element.value];
const img = element.parentElement.querySelector("img");
img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}
// Exchange Rate
async function updateExchangeRate() {
let amount = document.querySelector(".amount input");
let amtVal = amount.value.trim();
if (amtVal === "" || isNaN(amtVal) || Number(amtVal) <= 0) {
amount.value = 1;
amtVal = 1;
}
msg.innerHTML = "⏳ Fetching latest exchange rate...";
try {
const URL = `${BASE_URL}/${fromCurr.value}`;
const response = await fetch(URL);
const data = await response.json();
if (data.result === "error") {
msg.innerHTML = "❌ Currency not supported.";
return;
}
const rate = data.rates[toCurr.value];
if (!rate) {
msg.innerHTML = "❌ Exchange rate unavailable.";
return;
}
const finalAmount = (amtVal * rate).toLocaleString(undefined, {
minimumFractionDigits: 2,
maximumFractionDigits: 2,
});
msg.innerHTML = `
<strong>${amtVal} ${fromCurr.value}</strong><br>
=
]<br>
<strong>${finalAmount} ${toCurr.value}</strong>
<br><br>
<small>1 ${fromCurr.value} = ${rate.toFixed(4)} ${toCurr.value}</small>
`;
updated.innerHTML =
"Last Updated: " + new Date().toLocaleString();
  }
  catch (err) {
    console.log(err);
    msg.innerHTML = "❌ Unable to fetch exchange rate.";
  }
}
// Button
btn.addEventListener("click", (e) => {
 e.preventDefault();
  updateExchangeRate();
});
// Swap Button
swapBtn.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});
// Page Load
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});
