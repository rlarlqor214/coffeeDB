const pool = require("../../db/db");

exports.rendermenu = async (req, res) => {
    try {
        const menu1 = await pool.query("select * from menu");
        const userId = req.session.uid;
        return res.render("menu" , {
            title : "메뉴",
            menu : menu1[0],
            userId : userId,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.searchmenu = async (req, res) => {
    try{
        const { search } = req.body;
        req.session.searchData = search;
        return res.redirect("/search");
    }catch(error){
        console.log(error);
    }
}

exports.renderAddmenu = async (req, res) => {
    try{
        return res.render("addmenu", {
            title : "메뉴 추가",
        })
    }catch(error){
        console.log(error);
    }
}

exports.addMenu = async (req,res) => {
    try{
        const { menu_name , price } = req.body;
        const addmenu = await pool.query("insert into menu (menu_name , price) values (?,?)", [menu_name,price]);
        return res.send('<script>alert("메뉴가 정상적으로 추가되었습니다."); location.href="/menu"</script>');
    }catch(error){
        console.log(error)
    }
};


// 주문에 해당 메뉴가 없을 경우 가능 아니면 제약조건으로 인해 삭제 불가능
exports.deleteMenu = async (req, res) => {
    try {
        const menuNumber = req.body.menu_name;
        console.log(menuNumber)
        const deleteBasketItems = await pool.query("DELETE FROM basket_has_menu WHERE menu_menu_number = ?", [menuNumber]);
        const deleteMenu = await pool.query("DELETE FROM menu WHERE menu_number = ?", [menuNumber]);
        return res.send('<script>alert("메뉴가 정상적으로 삭제되었습니다."); location.href="/menu"</script>');
    } catch (error) {
        console.log(error);
    }
};