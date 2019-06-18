var BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets`;
var SHEET_ID = '1sNk9S1m2_kJmdj6FwesztvvdrzKFRRkBn7JFQGNY8TQ';
var API_KEY = 'AIzaSyDvK1O8LuQKbBH8UBePNCib-vtNmiIbqs0';
// var YESTERDAY = moment().subtract(1, 'days').format('DD/M/YY')
// var CURRENT_MONTH = moment().format('MMMM');
var YESTERDAY = moment().subtract(1, 'months').subtract(1, 'days').format('DD/M/YY')
var CURRENT_MONTH = moment().subtract(1, 'months').format('MMMM');
var PREVIOUS_MONTH = moment().subtract(1, 'months').format('MMMM');
var PREVIOUS_MONTH = moment().subtract(1, 'months').format('MMMM');

var recyclingBlock = $('.collection-grid .image-grid-block__item:eq(1) .block-body div')
var recyclingHtml = `
          <br>
          <p><strong>YESTERDAY</strong><br>
          <span id='yesterdayContaminatedBags'></span> out of <span id='yesterdayTotalBags'></span> bags contaminated (<span id='yesterdayContaminationRate'></span>%)</p>
          <p><strong>THIS MONTH SO FAR</strong><br>
          <span id='thisMonthContaminatedBags'></span> out of <span id='thisMonthTotalBags'></span> bags contaminated (<span id='thisMonthContaminationRate'></span>%)</p>
          <p><strong>LAST MONTH</strong><br>
          <span id='lastMonthContaminationRate'></span>% contamination rate</p>
          <br>
          <p>Top contaminant: <strong><span id='thisMonthTopContaminate'></span></strong></p>
          <br>
          <p><strong>On track to improving?</strong><br>
          <em><span style='font-size: 48px' id='thisMonthOnTrack'></span></em></p>
      `

recyclingBlock.html(recyclingHtml)

function getRecyclingData(month, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', BASE_URL + '/' + SHEET_ID + '/values/recycling:' + month + '!A5:D?key=' + API_KEY);
  xhr.onload = function () {
    if (xhr.status === 200) {
      callback(JSON.parse(xhr.response).values);
    }
    else {
      callback(false);
    }
  };
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
}

function yesterdaysData(data) {
  var yesterday = data.filter(function (v) {
    var currentDate = v[0]

    return currentDate === YESTERDAY
  });

  return {
    total_bags: yesterday[0][1],
    contaminated_bags: yesterday[0][2],
    contamination_rate: (parseInt(yesterday[0][2]) / parseInt(yesterday[0][1])) * 100
  }
}

function thisMonthsData(data, callback) {
  var count = 0, total_bags = 0, contaminated_bags = 0, contaminants = {}

  data.forEach(function (row) {
    count++;
    total_bags += parseInt(row[1]);
    contaminated_bags += parseInt(row[2]);

    if (!contaminants[row[3]]) {
      contaminants[row[3]] = 0;
    }

    contaminants[row[3]]++;

    if (count == data.length) {
      callback({
        total_bags: total_bags,
        contaminated_bags: contaminated_bags,
        contamination_rate: (contaminated_bags / total_bags) * 100,
        contaminants: contaminants
      })
    }
  });

  return true;
}

function lastMonthsData(data, callback) {
  var count = 0, total_bags = 0, contaminated_bags = 0, contaminants = {}

  data.forEach(function (row) {
    count++;
    total_bags += parseInt(row[1]);
    contaminated_bags += parseInt(row[2]);

    if (!contaminants[row[3]]) {
      contaminants[row[3]] = 0;
    }

    contaminants[row[3]]++;

    if (count == data.length) {
      callback({
        total_bags: total_bags,
        contaminated_bags: contaminated_bags,
        contamination_rate: (contaminated_bags / total_bags) * 100,
        contaminants: contaminants
      })
    }
  });

  return true;
}

function getTopContaminate(contaminants) {
  return Object.keys(contaminants).reduce(function (a, b) { return obj[a] > obj[b] ? a : b });
}

function onTrackToImproving(recyclingBlock) {
  var thisMonthContaminationRate = parseInt(recyclingBlock.find('#thisMonthContaminationRate').html())
  var lastMonthContaminationRate = parseInt(recyclingBlock.find('#lastMonthContaminationRate').html())

  if (thisMonthContaminationRate < lastMonthContaminationRate) {
    return "👍🏼"
  } else {
    return "👎🏼"
  }
}

getRecyclingData(CURRENT_MONTH, function (data) {
  if (data) {
    // # YESTERDAY
    var yesterday = yesterdaysData(data)

    recyclingBlock.find('#yesterdayTotalBags').html(yesterday.total_bags)
    recyclingBlock.find('#yesterdayContaminatedBags').html(yesterday.contaminated_bags)
    recyclingBlock.find('#yesterdayContaminationRate').html(yesterday.contamination_rate)

    thisMonthsData(data, function (thisMonth) {
      recyclingBlock.find('#thisMonthTotalBags').html(thisMonth.total_bags)
      recyclingBlock.find('#thisMonthContaminatedBags').html(thisMonth.contaminated_bags)
      recyclingBlock.find('#thisMonthContaminationRate').html(thisMonth.contamination_rate)

      recyclingBlock.find('#thisMonthTopContaminate').html(getTopContaminate(thisMonth.contaminants))
      recyclingBlock.find('#thisMonthOnTrack').html(onTrackToImproving(recyclingBlock))
    })
  } else {
    console.error('Failed to retrieve data');
    return false;
  }
});

getRecyclingData(PREVIOUS_MONTH, function (data) {
  if (data) {
    lastMonthsData(data, function (lastMonth) {
      recyclingBlock.find('#lastMonthContaminationRate').html(lastMonth.contamination_rate)
    })

    console.log(data)
  } else {
    console.error('Failed to retrieve data');
    return false;
  }
});
