const week = document.getElementById("week");
const month = document.getElementById("month");
const quarter = document.getElementById("quarter");
const years = document.getElementById("years");
const start = document.getElementById("start");
const end = document.getElementById("end");
const sel = document.getElementById("cur-select");
const worker = new Worker("worker.js");
let din = [["Year", "Sales", "Expenses"]];

const date = new Date();
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

function nowTime() {
  let toDay = "";
  toDay += `${to}`;
  start.innerHTML = start.value = toDay;
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

const mapping = {
  currentRate: (payload) => {
    const result = payload.filter(function (item, index, array) {
      return item.Cur_DateEnd.slice(0, 4) >= 2022;
    });

    arrCur = result[1];
    curName = arrCur.Cur_Name;
    filtered = arrCur.Cur_DateEnd;
    curId = arrCur.Cur_ID;

    function Selectt() {
      let newCur = document.getElementById("cur-select");
      for (let i = 0; i < result.length; i++) {
        newCur.innerHTML =
          newCur.innerHTML + "<option>" + result[i]["Cur_Name"] + "</option>";
      }
    }

    sel.onchange = function (ev) {
      arrCurr = result[ev.target.options.selectedIndex - 1];
      curName = arrCurr.Cur_Name;
      filtered = arrCurr.Cur_DateEnd;
      curId = arrCurr.Cur_ID;
      console.log(curName);
      console.log(start.value);

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

        function drawChart() {
          var data = google.visualization.arrayToDataTable(din);
          var options = {
            title: "Company Performance",
            curveType: "function",
            legend: { position: "bottom" },
          };
          var chart = new google.visualization.LineChart(
            document.getElementById("curve_chart")
          );
          chart.draw(data, options);
        }
        setTimeout(drawChart, 1000);
      }
    };
    Selectt();
  },
};
worker.addEventListener("message", ({ data }) => {
  mapping[data.msg](data.payload);
});
