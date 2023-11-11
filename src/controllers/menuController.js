const pool = require("../../db/db");

exports.rendermenu = async (req, res) => {
    try {
        const menu1 = await pool.query("select * from menu");
        return res.render("menu" , {
            title : "메뉴",
            menu : menu1[0],
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
