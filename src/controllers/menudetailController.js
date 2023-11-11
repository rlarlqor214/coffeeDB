const pool = require("../../db/db");


exports.rendermenuDetail = async (req, res) => {
    try {
        const pid = req.params.id;
        const menuname = await pool.query("select * from menu where menu_number = ?", [pid]);
        return res.render("detail", {
            title : "상세페이지",
            name: menuname[0][0].menu_name,
            price: menuname[0][0].price,
            menu_name : menuname[0][0].menu_name,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.pieceOrder = async (req,res) => {
    try{
        userId = req.session.uid;
        //지불 방식
        const payments = req.body.paymentMethod
        //메뉴이름
        const menu_name = req.body.menu_name

        //메뉴 가격
        const menu_price = await pool.query("select menu_number , price from menu where menu_name = ?" , [menu_name]);
        price = menu_price[0][0].price

        //메뉴 번호
        number= menu_price[0][0].menu_number

        //주문 날짜
        let today = new Date();
        let dateInfo = today.toISOString().split('T')[0];

        const ordernumber = await pool.query("insert into orders (user_userId,orderDate,payment,total_price) values (?,?,?,?)" , [userId,dateInfo,payments,price]);
        orderIds = ordernumber[0].insertId;

        const pieceOrders = await pool.query("insert into menu_has_orders (menu_menu_number, orders_order_number, order_quantity, order_price) values (?,?,?,?)", [number, orderIds, 1, price])
        
        return res.send('<script>alert("주문이 완료되었습니다"); location.href="/menu"</script>');
    }catch(error){
        console.log(error);
    }
}





