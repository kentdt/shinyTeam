var carStatus = prompt('Chọn trạng thái xe - Vào (in), Ra (out)', "");
var licensePlate, carType;

//xe vao
if (carStatus == 'in') {
     var curDate = new Date().getTime();
     curDate = new Date(curDate);
     localStorage.setItem('deliveryDate', curDate);
     // Set up a series of prompts, default responses, validation functions and action functions
     var dialogData = [
          {
               id: 1,
               str: "Nhập bảng số xe: ",
               r: "",//default response
               validateFn: function (r) {
                    var pattern = /[0-9]{2}-[A-Za-z][0-9]-[0-9]{4,5}/;
                    //console.log(pattern.test(r));
               if (! (r.length <= 11 && pattern.test(r))) {
                    alert("Vui lòng nhập đúng dữ liệu bảng số xe! XX-XX-XXXXX");
               }
                    return r.length <= 11 && pattern.test(r);
               }, //returns true if successful, otherwise false
               actionFn: function(r) { //what to do if successful
                    licensePlate = r;
                    localStorage.setItem('licensePlate', r);
               }
          },
          {
               id: 2,
               str: "Nhập loại xe: ",
               r: "",//default response
               validateFn: function (r) {
                    if (!(r !== '' && isNaN(Number(r)))) {
                         alert("Vui lòng nhập loại xe dạng text!");
                    }
                    return r !== '' && isNaN(Number(r));
               },//returns true if successful, otherwise false
               actionFn: function(r) {//what to do if successful
                    carType = r;
                    localStorage.setItem('carType', r);
               }
          },
     ];

     var go = true;//flag that determines whether to continue looping through dialogData.
     for (var i=0; go && i < dialogData.length; i++) {
          go = promptDialog(dialogData[i], carStatus);
     }
     document.write("Bảng số xe: " + window.localStorage.getItem('licensePlateIn') + "<br />");
     document.write("Loại xe: " + window.localStorage.getItem('carType') + "<br />");
     document.write("Ngày giờ gửi: " + window.localStorage.getItem('deliveryDate') + "<br />");

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
     const fs = require('browserify-fs')
     let data = "Hello and Welcome to linuxhint.com"
     fs.writeFile('file.txt', data, (err) => {
     // error handling using throw
     if (err) throw err;
     })

}
//xe ra
if (carStatus == 'out') {
     var dialogData =
          [
               {
                    str: "Nhập bảng số xe: ",
                    r: "",//default response
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
                    actionFn: function(r) { //what to do if successful
                         //tinh phi va remove xe
                         var curDate = new Date().getTime();
                         curDate = new Date(curDate);
                         localStorage.setItem('outDate', curDate);
                         carCost = carCost(r, oldList);
                         localStorage.setItem('carCost', carCost);
                         const newList = oldList.filter(({licensePlate}) => licensePlate !== r);
                         localStorage.setItem('listData', JSON.stringify(newList));
                    }
               }
          ];
     var go = true;//flag that determines whether to continue looping through dialogData.
     for (var i=0; go && i < dialogData.length; i++) {
          go = promptDialog(dialogData[i], carStatus);
     }
}

function carCost(listData)
{
     var fee = 5000;
     const deliveryDate = new Date(listData[0].ngaygui);
     const outDate = new Date(localStorage.getItem('outDate'));
     const diffInMs = outDate - deliveryDate;
     const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
     if (diffInDays >= 1) {
          feeCostAdd = diffInDays * 20000;
          fee = fee + feeCostAdd;
     }
     return parseInt(fee);
}

 /*
     * promptDialog({str, r, validateFn, actionFn});
     *  This function will repeatedly prompt the user
     *  until either a valid response is entered
     *  or the prompt dialog is cancelled.
     */
function promptDialog(data, carStatus)
{
     var response = data.r;
     while(true) { //prompt repeatedly until use provides a valid response or cancels
          var response = prompt(data.str, response);
          if (response === null) {
               break;
          } //user cancelled
          if (!data.validateFn || typeof data.validateFn !== 'function') {
               return response; //assume OK if no validate function is specified
          }
          if (data.validateFn(response)) {
               if (data.actionFn && typeof data.actionFn == 'function') {//if an action is specified
                    data.actionFn(response);//perform the action
               }
               return response;
          }
     }
     return false;//return false if we broke out of the while loop
}