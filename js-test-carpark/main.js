var carStatus = prompt('Chọn trạng thái xe - Vào (in), Ra (out)', "");
var licensePlate, carType;

//xe vao
if (carStatus == 'in') {
     var curDate = new Date().getTime();
     curDate = new Date(curDate);
     localStorage.setItem('deliveryDate', curDate);
     var dialogData = [
          {
               str: "Nhập bảng số xe: ",
               r: "", //default response
               validateFn: function (r) {
                    var pattern = /[0-9]{2}-[A-Za-z][0-9]-[0-9]{4,5}/;
                    if (! (r.length <= 11 && pattern.test(r))) {
                    alert("Vui lòng nhập đúng dữ liệu bảng số xe! XX-XX-XXXXX");
                    return false;
                    }
                    oldList = JSON.parse(localStorage.getItem('listData'));
                    if (oldList !== null) {
                         const findCode = oldList.find(({ licensePlate }) => licensePlate === r);
                         if (findCode !== undefined) {
                              alert('Xe đã có trong bãi vui lòng nhập lại!');
                              return false;
                         }
                    }
                    return r.length <= 11 && pattern.test(r);
               }, //returns true if successful, otherwise false
               actionFn: function(r) { //if successful
                    licensePlate = r;
                    localStorage.setItem('licensePlate', r);
               }
          },
          {
               str: "Nhập loại xe: ",
               r: "", //default response
               validateFn: function (r) {
                    if (!(r !== '' && isNaN(Number(r)))) {
                         alert("Vui lòng nhập loại xe dạng text!");
                    }
                    return r !== '' && isNaN(Number(r));
               }, //returns true if successful, otherwise false
               actionFn: function(r) {//if successful
                    carType = r;
                    localStorage.setItem('carType', r);
               }
          },
     ];

     var go = true;
     for (var i=0; go && i < dialogData.length; i++) {
          go = promptDialog(dialogData[i], carStatus);
     }

     listDataInput =
          [
               {
                    licensePlate: localStorage.getItem('licensePlate'),
                    carType: localStorage.getItem('carType'),
                    deliveryDate: formatDate(localStorage.getItem('deliveryDate')),
               }
          ];

     if (localStorage.getItem('listData') == null) {
          localStorage.setItem('listData', JSON.stringify(listDataInput));
     } else {
          oldListData = JSON.parse(localStorage.getItem('listData'));
          const newlistData  = oldListData.concat(listDataInput);
          localStorage.setItem('listData', JSON.stringify(newlistData));
          localStorage.setItem('deliveryDate', formatDate(curDate));
     }
     document.write("Bảng số xe: " + localStorage.getItem('licensePlate') + "<br />");
     document.write("Loại xe: " + localStorage.getItem('carType') + "<br />");
     document.write("Ngày giờ gửi: " + localStorage.getItem('deliveryDate') + "<br />");

     listDataOutPut = JSON.parse(localStorage.getItem('listData'));
     writeTable(listDataOutPut);

}

//xe ra
if (carStatus == 'out') {
     var dialogData =
          [
               {
                    str: "Nhập bảng số xe: ",
                    r: "", //default response
                    validateFn: function (r) {
                    var pattern = /[0-9]{2}-[A-Za-z][0-9]-[0-9]{4,5}/;
                    oldList = JSON.parse(localStorage.getItem('listData'));
                    const findCode = oldList.find(({ licensePlate }) => licensePlate === r);
                    if (findCode === undefined) {
                         alert('Không tìm thấy bảng số xe!');
                         return false;
                    }
                    return r.length <= 11 && pattern.test(r);
                    }, //returns true if successful, otherwise false
                    actionFn: function(r) { //if successful
                         //tinh phi va remove xe
                         var curDate = new Date().getTime();
                         curDate = new Date(curDate);
                         localStorage.setItem('outDate', curDate);
                         oldList = JSON.parse(localStorage.getItem('listData'));
                         cost = carCost(oldList);
                         localStorage.setItem('carCost', cost);
                         const newList = oldList.filter(({licensePlate}) => licensePlate !== r);
                         localStorage.setItem('listData', JSON.stringify(newList));
                    }
               }
          ];
     var go = true;
     for (var i=0; go && i < dialogData.length; i++) {
          go = promptDialog(dialogData[i], carStatus);
     }
     document.write("Bảng số xe ra: " + localStorage.getItem('licensePlate') + "<br />");
     document.write("Loại xe ra: " + localStorage.getItem('carType') + "<br />");
     document.write("Ngày giờ ra: " + formatDate(localStorage.getItem('outDate')) + "<br />");
     document.write("Giá tiền: " + localStorage.getItem('carCost') + " vnd <br />");
     listDataOutPut = JSON.parse(localStorage.getItem('listData'));
     writeTable(listDataOutPut);
}

//phi gui xe
function carCost(listData)
{
     var fee = 5000;
     const deliveryDate = new Date(listData[0].deliveryDate);
     //const outDate = new Date('Fri Mar 27 2022 02:23:54 GMT+0700 (Indochina Time)');
     const outDate = new Date(localStorage.getItem('outDate'));
     const diffInMs = outDate - deliveryDate;
     const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
     if (diffInDays >= 1) {
          feeCostAdd = diffInDays * 20000;
          fee = fee + feeCostAdd;
     }
     return parseInt(fee);
}

//loop prompt
function promptDialog(data)
{
     var response = data.r;
     while(true) { //prompt loop til valid response or cancel
          var response = prompt(data.str, response);
          if (response === null) {
               break;
          } //user cancelled
          if (!data.validateFn || typeof data.validateFn !== 'function') {
               return response; //if no validate
          }
          if (data.validateFn(response)) {
               if (data.actionFn && typeof data.actionFn == 'function') { //if an action is specified
                    data.actionFn(response); //perform the action
               }
               return response;
          }
     }
     return false;
}

//format date
function formatDate(date) {
     date = new Date(date);
     var year = date.getFullYear(),
        month = date.getMonth() + 1, // months are zero indexed
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
        minuteFormatted = minute < 10 ? "0" + minute : minute,
        morning = hour < 12 ? " am" : " pm";

    return  day + "/" + month + "/" + year + " " + hourFormatted + ":" +
            minuteFormatted + morning;
}

function writeTable(data)
{
     var col = [];
        for (var i = 0; i < data.length; i++) {
            for (var key in data[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
     }
     var table = document.createElement("table");
     var tr = table.insertRow(-1);                   // TABLE ROW.

     for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
     }
      for (var i = 0; i < data.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = data[i][col[j]];
            }
     }
     document.getElementById("container").appendChild(table);
     const elements = document.getElementsByClassName("input_info");
     while (elements.length > 0) elements[0].remove();
}