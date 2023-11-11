const pool = require("../../db/db");

exports.renderCreate = async (req, res) => {
    try {
        return res.render("create" , {
            title : "회원가입"
        });
    } catch (error) {
        console.log(error);
    }
};

exports.signup = async (req,res) => {
    try{
        const { uid,upw,uname, unumber, uaddress} = req.body;
        const createUser = await pool.query("insert into user (userid,password,user_name,number,address) value(?,?,?,?,?)" ,
        [uid,upw,uname,unumber,uaddress]);
        return res.redirect("/");
    }catch(error){
        console.log(error);
    }
}

