onmessage = async function (event) {
  let id = event.data.idw;
  let start = event.data.dateStart;
  let end = event.data.dateEnd;
  let curResponse = await fetch(
    `https://www.nbrb.by/API/ExRates/Rates/Dynamics/${id}?startDate=${start}&endDate=${end}`
  );
  let curContent = await curResponse.json();
  postMessage(curContent);
};
