const pool = require("../../db/db");


exports.renderOrder = async (req, res) => {
    try {
        const userId = req.session.uid;

        // 사용자에 대한 주문 목록 가져오기
        const orders = await pool.query('SELECT * FROM orders WHERE user_userId = ?', [userId]);
        if(orders[0].length === 0){
            return res.send('<script>alert("주문 내역이 없습니다."); location.href="/"</script>')
        }else{
            // 주문 번호에 대한 주문 내역 가져오기
        const orderDetails = await Promise.all(orders[0].map(async (order) => {
            const menuOrders = await pool.query('SELECT * , order_quantity * order_price as order_price  FROM menu_has_orders WHERE orders_order_number = ?', [order.order_number]);

            return {
                order,
                menuOrders: menuOrders[0]
            };
        }));
        res.render('order', { title: '사용자 주문 목록', orderDetails });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.remove = async (req, res) => {
    try{
        //유저 아이디
        const userId = req.session.uid;

        //장바구니 번호
        const basketnumber = await pool.query("select basketId from basket where user_userId =?", [userId]);
        basketId = basketnumber[0][0].basketId;

        //지불 방식
        const payments = req.body
        payment = payments.paymentMethod;

        //총가격
        const menuprice = await pool.query("select sum(price * quantity) as total_price from basket_has_menu where basket_basketId = ?", [basketId]);
        total = menuprice[0][0].total_price
        
        //주문 날짜
        let today = new Date();
        let dateInfo = today.toISOString().split('T')[0];
        
        //주문번호 추가
        const ordernumber = await pool.query("insert into orders (user_userId,orderDate,payment,total_price) values (?,?,?,?)" , [userId,dateInfo,payment,total]);
        const orderIds = ordernumber[0].insertId;

        const basketInfo = await pool.query("select * from basket_has_menu where basket_basketId = ?" , [basketId]);
        //주문번호에 맞는 곳에 값 넣기
        for (const basketItem of basketInfo[0]) {
            const { menu_menu_number, price, quantity } = basketItem;
            await pool.query("INSERT INTO menu_has_orders (menu_menu_number, orders_order_number, order_quantity, order_price) VALUES (?, ?, ?, ?)", [menu_menu_number, orderIds, quantity, price]);
        }

        await pool.query("delete from basket_has_menu where basket_basketId = ?", [basketId]);
        await pool.query("delete from basket where user_userId = ?" , [userId]);
        return res.send('<script>alert("주문이 완료되었습니다"); location.href="/"</script>');

    }catch(error){
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
