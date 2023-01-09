const week = document.getElementById("week");
const month = document.getElementById("month");
const quarter = document.getElementById("quarter");
const years = document.getElementById("years");
const start = document.getElementById("start");
const ussd = document.getElementById("ussd");
const eur = document.getElementById("eur");
const rub = document.getElementById("rub");
const end = document.getElementById("end");
const sel = document.getElementById("cur-select");
const worker = new Worker("worker.js");
let din = [["Year", "Sales", "Expenses"]];

const date = new Date();
console.log(date);
const to = String(new Date(Date.now()).toISOString()).slice(0, 10);
const lastWeek = String(
  new Date(Date.now() + -7 * 24 * 3600 * 1000).toISOString()
).slice(0, 10);
const lastMonth = String(
  new Date(Date.now() + -30 * 24 * 3600 * 1000).toISOString()
).slice(0, 10);
const lastQuarter = String(
  new Date(Date.now() + -123 * 24 * 3600 * 1000).toISOString()
).slice(0, 10);
const lastYear = String(
  new Date(Date.now() + -365 * 24 * 3600 * 1000).toISOString()
).slice(0, 10);
let toDay = "";
let toWeek = "";
toWeek += `${lastWeek}`;
toDay += `${to}`;
console.log(toDay);
const worker2 = new Worker("worker2.js");
worker2.onmessage = mesa;

worker2.postMessage({
  idt: toDay,
});
function mesa(event) {
  let curContented = event.data;
  let curSD = curContented[0].Cur_OfficialRate;
  let curSE = curContented[1].Cur_OfficialRate;
  let curSR = curContented[2].Cur_OfficialRate;
  console.log(curContented);
  ussd.innerHTML = curSD;
  eur.innerHTML = curSE;
  rub.innerHTML = curSR;
}

function nowTime() {
  start.innerHTML = start.value = toWeek;
  end.innerHTML = end.value = toDay;
  start.setAttribute("min", "2021-12-29");
  start.setAttribute("max", "2023-06-04");
  end.setAttribute("min", "2021-12-29");
  end.setAttribute("max", "2023-06-04");
}
nowTime();
week.addEventListener("click", function () {
  let toDay = "";
  let weekAgo = "";
  toDay += `${to}`;
  weekAgo += `${lastWeek}`;
  start.innerHTML = start.value = weekAgo;
  end.innerHTML = end.value = toDay;
});
month.addEventListener("click", function () {
  let toDay = "";
  let monthAgo = "";
  toDay += `${to}`;
  monthAgo += `${lastMonth}`;
  start.innerHTML = start.value = monthAgo;
  end.innerHTML = end.value = toDay;
  rrr();
});

quarter.addEventListener("click", function () {
  let toDay = "";
  let quarterAgo = "";
  toDay += `${to}`;
  quarterAgo += `${lastQuarter}`;
  start.innerHTML = start.value = quarterAgo;
  end.innerHTML = end.value = toDay;
});
year.addEventListener("click", function () {
  let toDay = "";
  let yearAgo = "";
  toDay += `${to}`;
  yearAgo += `${lastYear}`;
  start.innerHTML = start.value = yearAgo;
  end.innerHTML = end.value = toDay;
});
function drawChart() {
  var data = google.visualization.arrayToDataTable(din);
  var options = {
    title: "Rate dynamics",
    curveType: "function",
    legend: { position: "bottom" },
  };
  var chart = new google.visualization.LineChart(
    document.getElementById("curve_chart")
  );
  chart.draw(data, options);
}
let result = 1;
const mapping = {
  currentRate: (payload) => {
    result = payload.filter(function (item, index, array) {
      return item.Cur_DateEnd.slice(0, 4) >= 2022;
    });

    //arrCur = result[1];
    //console.log(result[3]);
    //curName = arrCur.Cur_Name;
    //filtered = arrCur.Cur_DateEnd;
    // curId = arrCur.Cur_ID;

    function Selectt() {
      let newCur = document.getElementById("cur-select");
      for (let i = 0; i < result.length; i++) {
        newCur.innerHTML =
          newCur.innerHTML + "<option>" + result[i]["Cur_Name"] + "</option>";
      }
    }
    Selectt();
  },
};

function rrr() {
  const worker1 = new Worker("worker1.js");
  worker1.onmessage = mess;

  worker1.postMessage({
    idw: curId,
    dateStart: start.value,
    dateEnd: end.value,
  });
  function mess(event) {
    let curContent = event.data;
    console.log(curContent);
    console.log(curContent);
    let tableContent = "";

    for (let i = 0; i < curContent.length; i++) {
      let curRate = curContent[i].Cur_OfficialRate;
      let curDate = curContent[i].Date.slice(0, 10);
      din.push([curDate, curRate, 0]);
      tableContent += `<div>${curRate}руб</div>`;
    }
    CurRate.innerHTML = tableContent;
    console.log(din);
    google.charts.load("current", { packages: ["corechart"] });

    setInterval(drawChart, 1500);
  }
}

sel.onchange = function ttt(ev) {
  arrCurr = result[ev.target.options.selectedIndex - 1];

  curId = arrCurr.Cur_ID;

  rrr();
};

worker.addEventListener("message", ({ data }) => {
  mapping[data.msg](data.payload);
});
