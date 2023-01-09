onmessage = async function (event) {
  let idy = event.data.idt;

  let curResponse = await fetch(
    `https://www.nbrb.by/API/ExRates/Rates/Dynamics/431?startDate=${idy}&endDate=${idy}`
  );
  let curContented = await curResponse.json();

  let curResponseS = await fetch(
    `https://www.nbrb.by/API/ExRates/Rates/Dynamics/451?startDate=${idy}&endDate=${idy}`
  );
  let curContentedD = await curResponseS.json();

  let curResponseR = await fetch(
    `https://www.nbrb.by/API/ExRates/Rates/Dynamics/456?startDate=${idy}&endDate=${idy}`
  );
  let curContentedR = await curResponseR.json();

  Array.prototype.push.apply(curContented, curContentedD);

  Array.prototype.push.apply(curContented, curContentedR);

  postMessage(curContented);
};
