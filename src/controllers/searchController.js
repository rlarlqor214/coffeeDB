const pool = require("../../db/db");

exports.renderSearchmenu = async (req,res) => {
    try{

        const searchData = req.session.searchData;
        const searchmenu = await pool.query("select * from menu where menu_name like ?" , [`%${searchData}%`]);
        console.log(searchData)
        return res.render("search" , {
            title : "검색메뉴",
            menu : searchmenu[0],
        })

    }catch(error){
        console.log(error);
    }
}