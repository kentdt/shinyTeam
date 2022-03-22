var carStatus = prompt('Chọn trạng thái xe - Vào (in), Ra (out)', "");
var licensePlate, carType;

//xe vao
if (carStatus == 'in') {
     var curDate = new Date().getTime();
     curDate = new Date(curDate);
     localStorage.setItem('deliveryDate', curDate);
     var dialogData = [
          {
               id: 1,
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
               id: 2,
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
     document.write("Bảng số xe: " + localStorage.getItem('licensePlate') + "<br />");
     document.write("Loại xe: " + localStorage.getItem('carType') + "<br />");
     document.write("Ngày giờ gửi: " + localStorage.getItem('deliveryDate') + "<br />");

     listDataInput =
          [
               {
                    licensePlate: localStorage.getItem('licensePlate'),
                    carType: localStorage.getItem('carType'),
                    ngaygui: localStorage.getItem('deliveryDate'),
               }
          ];

     if (localStorage.getItem('listData') == null) {
          localStorage.setItem('listData', JSON.stringify(listDataInput));
     } else {
          oldListData = JSON.parse(localStorage.getItem('listData'));
          const newlistData  = oldListData.concat(listDataInput);
          localStorage.setItem('listData', JSON.stringify(newlistData));
          localStorage.setItem('deliveryDate', curDate);
     }

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
     document.write("Bảng số xe: " + localStorage.getItem('licensePlate') + "<br />");
     document.write("Loại xe: " + localStorage.getItem('carType') + "<br />");
     document.write("Ngày giờ ra: " + localStorage.getItem('outDate') + "<br />");
     document.write("Giá tiền: " + localStorage.getItem('carCost') + " vnd <br />");
}


function carCost(listData)
{
     var fee = 5000;
     const deliveryDate = new Date(listData[0].ngaygui);
     const outDate = new Date('Fri Mar 25 2022 02:23:54 GMT+0700 (Indochina Time)');
     //const outDate = new Date(localStorage.getItem('outDate'));
     const diffInMs = outDate - deliveryDate;
     const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
     if (diffInDays >= 1) {
          feeCostAdd = diffInDays * 20000;
          fee = fee + feeCostAdd;
     }
     return parseInt(fee);
}

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