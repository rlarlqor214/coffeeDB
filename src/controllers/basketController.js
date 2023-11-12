const pool = require("../../db/db");

exports.renderBasket = async (req, res) => {
    try {
        const userId = req.session.uid;

        if (!userId) {
            return res.redirect("/login");
        }
        const basketnumber = await pool.query("select basketId from basket where user_userId = ?", [userId]);
        if(basketnumber[0][0] === undefined){
            return res.send('<script>alert("장바구니가 없습니다."); location.href="/"</script>')
        }else{
            basketId = basketnumber[0][0].basketId
            const basketInfo = await pool.query(
                "select menu_name , price ,quantity,price * quantity as total_price from basket_has_menu where basket_basketId = ?",
                [basketId]
            );
            res.render("basket", {
                items: basketInfo[0],
            });
        }
        // 사용자의 장바구니 정보 가져오기
    } catch (error) {
        console.log(error);
    }
};


exports.addToCart = async (req, res) => {
    try {
        const menuName = req.body.menu_name;
        const userId = req.session.uid;
        const menuInfo = await pool.query("select * from menu where menu_name = ?", [menuName]);

        const number = menuInfo[0][0].menu_number;
        const price = menuInfo[0][0].price;
        const basketnumber = await pool.query("select basketId from basket where user_userId = ?", [userId]);
            basketId = basketnumber[0][0].basketId
            const menuinbasket = await pool.query("select quantity from basket_has_menu where basket_basketId = ? and menu_menu_number = ?",[basketId,number]);
            if(menuinbasket[0].length == 0){
                await pool.query("insert into basket_has_menu (basket_basketId, menu_menu_number, menu_name, price,quantity) values (?,?,?,?,?)", [basketId,number,menuName,price,1]);
            }else{
                await pool.query("update basket_has_menu set quantity = quantity + 1 where basket_basketId = ? and menu_menu_number =?",[basketId,number]);
        }
    }catch(error){
        console.log(error);
    }
};

exports.updateBasket = async (req, res) => {
    try {
        const userId = req.session.uid;
        const { menu_name, quantities } = req.body;
        const basketInfo = await pool.query("select basketId from basket where user_userId = ?", [userId]);
        basketId = basketInfo[0][0].basketId

        const updatemenu = await pool.query("UPDATE basket_has_menu SET quantity = ? WHERE basket_basketId = ? AND menu_name = ?", [
            quantities,
            basketId,
            menu_name,
        ]);

        res.redirect("/basket");
    } catch (error) {
        console.log(error);
    }
};

exports.deleteBasket = async (req, res) => {
    try {
        const userId = req.session.uid;
        const  menuIdDelete = req.body.menu_name;
        const basketInfo = await pool.query("select basketId from basket where user_userId = ?", [userId]);
        basketId = basketInfo[0][0].basketId
        console.log(req.body);

        const deletemenu = await pool.query("DELETE FROM basket_has_menu WHERE basket_basketId = ? AND menu_name = ?", [
            basketId,
            menuIdDelete,
        ]);

        res.redirect("/basket");
    } catch (error) {
        console.log(error);
    }
};

