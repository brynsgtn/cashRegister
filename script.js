// Script

const cashInputEl = document.getElementById("cash");
const changeDivEl = document.getElementById("change-due");
const totalDivEl = document.getElementById("total");
const purchaseBtnEl = document.getElementById("purchase-btn");
const cidDrawerEl = document.getElementById("cash-in-drawer");
const changeContainerEl = document.getElementById("change-container");

let price = 19.5;

totalDivEl.innerHTML =`<p>Total Due: $${price}</p>`
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];


const displayStatus = (status, change) => {
    changeDivEl.innerHTML = `<p class="change-header">Status: ${status}</p>`;
  change.map(bill => (changeDivEl.innerHTML += `<p class="change-content">${bill[0]}: $${bill[1]}</p>`)
  );
  return;
};

const purchaseCalculation = () => {
  const cashValue = Number(cashInputEl.value);
  
  let change = cashValue - price;
  const reversedCid = [...cid].reverse();
  const denomination = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  const totalCid = parseFloat(cid.map(total => total[1]).reduce((prev, curr) => prev + curr).toFixed(2)
  );

  const statusUpdate = { status: "OPEN", change: [] }

  if (cashValue < price || isNaN(cashValue)) {
    alert("Customer does not have enough money to purchase the item");
    cashInputEl.value = "";
    return;
  }
 console.log(price)
 console.log(cashValue)
 console.log(typeof price)
 console.log(typeof cashValue)
  if (cashValue === price) {
    changeDivEl.innerHTML =
      `<p class="change-header">No change due - customer paid with exact cash</p>`;
    cashInputEl.value = "";
    changeContainerEl.style.display = "block"
    return;
  }

  if (totalCid < change) {
    changeContainerEl.style.display = "block"
    return (changeDivEl.innerHTML = `<p class="change-header">Status: INSUFFICIENT_FUNDS</p>`);
  } else if (totalCid === change) {
    displayStatus("CLOSED", [[cid[0][0], cid[0][1]]]);
    updatedCid(change);
    changeContainerEl.style.display = "block"
  } else {
    let changeArr = [];
    
    for(let i = 0; i < reversedCid.length; i++) {
      if (change > denomination[i] && change > 0) {
        let amount = 0;
        let total = reversedCid[i][1];
        while (total > 0 && change >= denomination[i]) {
          total -= denomination[i];
          change = parseFloat((change - denomination[i]).toFixed(2));
          amount++;
        }
        if (amount > 0) {
          statusUpdate.change.push([reversedCid[i][0], amount * denomination[i]]);
        }
      }
    }
    if (change > 0) {
      return (changeDivEl.innerHTML = `<p class="change-header">Status: INSUFFICIENT_FUNDS</p>`);
    }
  }

  displayStatus(statusUpdate.status, statusUpdate.change);
  updatedCid(statusUpdate.change);
  changeContainerEl.style.display = "block"
};


const updatedCid = (change) => {
 
  
  if (change) {
    change.forEach(changeArr => {
      const myArr = cid.find(cidArr => cidArr[0] === changeArr[0]);
      myArr[1] = parseFloat((myArr[1] - changeArr[1]).toFixed(2));
    });
  }

  cashInputEl.value = "";
  cidDrawerEl.innerHTML = `<p class="cash-drawer-header">Cash in Drawer:</p>`;
  cid.forEach(item => {
    cidDrawerEl.innerHTML += `<p class="cash-drawer-content">${item[0]}: $${item[1]}</p>`;
  });
};

purchaseBtnEl.addEventListener("click", purchaseCalculation);

cashInputEl.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    purchaseCalculation();
  }
});

updatedCid([]);
