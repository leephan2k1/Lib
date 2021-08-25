function createCalendar(elem, year, month) {
    //Do tháng trong JS đếm bắt đầu từ 0
    let mon = month - 1;
    let d = new Date(year, mon);
    //Tạo thứ table header thứ 2 -> chủ nhật
    let table = '<table><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr>';
    //tạo khoảng trống từ thứ 2 đến ngày đầu tháng
    for (let i = 0; i < getDay(d); i++) {
        table += '<td></td>';
    }
    while (d.getMonth() == mon) {
        //truyền date vào thẻ td
        table += '<td>' + d.getDate() + '</td>';
        //xuống hàng cho ngày chủ nhật
        if (getDay(d) % 7 == 6) {
            table += '</tr>';
        }
        //step để thoát vòng lặp
        d.setDate(d.getDate() + 1);
    }
    //Thêm khoảng trống cho ô sau ngày 30 hoặc 31
    if (getDay(d) != 0) {
        for (let i = getDay(d); i < 7; i++) {
            table += '<td></td>';
        }
    }
    elem.innerHTML = table;
}
//Custom lại hàm getDay t2 -> cn <=> 0->6
function getDay(date) { // get day number from 0 (monday) to 6 (sunday)
    let day = date.getDay();
    if (day == 0) day = 7; // make Sunday (0) the last day
    return day - 1;
}
createCalendar(document.getElementById('calendar'), 2021, 7);