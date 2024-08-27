// Script

const cashInputEl = document.getElementById("cash") as HTMLInputElement | null;
if (!cashInputEl) {
  throw new Error("cashInputEl element not found");
}
const changeDivEl = document.getElementById("change-due") as HTMLDivElement | null;
if (!changeDivEl) {
  throw new Error("changeDivEl element not found");
}
const totalDivEl = document.getElementById("total") as HTMLDivElement | null;
if (!totalDivEl) {
  throw new Error("totalDivEl element not found");
}
const purchaseBtnEl = document.getElementById("purchase-btn") as HTMLButtonElement | null;
if (!purchaseBtnEl) {
  throw new Error("purchaseBtnEl element not found");
}
const cidDrawerEl = document.getElementById("cash-in-drawer") as HTMLDivElement | null;
if (!cidDrawerEl) {
  throw new Error("cidDrawerEl element not found");
}
const changeContainerEl = document.getElementById("change-container") as HTMLDivElement | null;
if (!changeContainerEl) {
  throw new Error("changeContainerEl element not found");
}

let price: number = 19.5;


totalDivEl.innerHTML =`<p>Total Due: $${price}</p>`
let cid: [string, number] [] = [
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


const displayStatus = (status: string, change: [string, number][]): void => {
  changeDivEl!.innerHTML = `<p class="change-header">Status: ${status}</p>`;
  change.map((bill: [string, number]) => {(changeDivEl.innerHTML += `<p class="change-content">${bill[0]}: $${bill[1]}</p>`)
  });
};

const purchaseCalculation = (): void => {
  const cashValue: number = Number(cashInputEl.value);
  
  let change: number = cashValue - price;
  const reversedCid: [string, number][] = [...cid].reverse();
  const denomination: number[] = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  const totalCid: number = parseFloat(cid.map(total => total[1]).reduce((prev, curr) => prev + curr).toFixed(2)
  );

  const statusUpdate: {status: string, change: [string, number][]} = { status: "OPEN", change: [] }

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
    changeDivEl.innerHTML = `<p class="change-header">Status: INSUFFICIENT_FUNDS</p>`
    return;

  } else if (totalCid === change) {
    displayStatus("CLOSED", [[cid[0][0], cid[0][1]]]);
    updatedCid(statusUpdate.change);
    changeContainerEl.style.display = "block"
  } else {
    
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
      changeDivEl.innerHTML = `<p class="change-header">Status: INSUFFICIENT_FUNDS</p>`
      return;
    }
  }

  displayStatus(statusUpdate.status, statusUpdate.change);
  updatedCid(statusUpdate.change);
  changeContainerEl.style.display = "block"
};


const updatedCid = (change: [string, number][]) => {
 
  
  if (change) {
    change.forEach((changeArr: [string, number]) => {
      const myArr: [string, number] | undefined = cid.find(cidArr => cidArr[0] === changeArr[0]);
      if (myArr) {
        myArr[1] = parseFloat((myArr[1] - changeArr[1]).toFixed(2));
      } else {
        throw new Error("myArr is undefined")
      }

    });
  }

  cashInputEl.value = "";
  cidDrawerEl.innerHTML = `<p class="cash-drawer-header">Cash in Drawer:</p>`;
  cid.forEach(item => {
    cidDrawerEl.innerHTML += `<p class="cash-drawer-content">${item[0]}: $${item[1]}</p>`;
  });
};

purchaseBtnEl.addEventListener("click", purchaseCalculation);

cashInputEl.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    purchaseCalculation();
  }
});

updatedCid([]);
