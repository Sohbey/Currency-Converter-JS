// Define the base URL of the API used to fetch the latest exchange rates
const BASE_URL =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

// Select all dropdowns and button elements from the DOM
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");

// Select specific dropdown elements for "from" and "to" currencies
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// Select the message element to display conversion information
const msg = document.querySelector(".msg");

// Iterate over each dropdown element and populate it with currency options
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selections for "from" and "to" currencies
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "GBP") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  // Add event listener to each dropdown for flag update on change
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update exchange rate based on selected currencies

// Construct the URL to fetch exchange rate data
const updateExchangeRate = async () => {
  // Get the amount input value and ensure it's valid
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  // Construct the URL to fetch exchange rate data
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
  // Log the URL to inspect before making the fetch request
  console.log("URL:", URL);
  // Fetch exchange rate data from the API
  try {
    let response = await fetch(URL);
    let responseData = await response.text();
    let data;
    try {
      data = JSON.parse(responseData);
    } catch (parseError) {
      throw new Error("Invalid JSON format");
    }
    let rate = data[toCurr.value.toLowerCase()];

    // Calculate the final converted amount
    let finalAmount = amtVal * rate;
    // Display the conversion information
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    // Handle any errors that occur during the fetch request
    console.error("Error fetching exchange rate:", error);
    if (error instanceof SyntaxError) {
      msg.innerText = "Error: Invalid JSON format in API response.";
    } else {
      msg.innerText = "Error fetching exchange rate. Please try again later.";
    }
  }
};

// Function to update flag based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listener for button click to initiate exchange rate update
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Event listener for window load to update exchange rate on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
