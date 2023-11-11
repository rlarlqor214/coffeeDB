const pool = require("../../db/db");

exports.render = async (req,res) => {
    try{

        if(req.session.uid) {
            log = "로그아웃";
            signUp = "none";
        } else {
            log = "로그인";
            signUp = "inline";
        }
        return res.render("index", {
            title : "메인페이지",
            login : log,
            signUp : signUp,
        });

    }catch(error){
        console.log(error);
    }
}