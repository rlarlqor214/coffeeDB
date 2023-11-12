const pool = require("../../db/db");

exports.renderLogin = async (req, res) => {
    try {
        if (req.session.uid) {
            delete req.session.uid;
            return res.redirect("/");
        }
        return res.render("login", {
            title: "로그인",
        });
    } catch (error) {
        console.log(error);
    }
};

exports.login = async (req, res) => {
    try {
        const { userid, userpw } = req.body;
        const isuser = await pool.query("select * from user where userid = ?", [userid]);

        if (isuser[0].length == 0) {
            return res.send('<script>alert("회원이 아닙니다"); location.href="/login"</script>');
        } else {
            if (userpw == isuser[0][0].password) {
                req.session.uid = userid;
                userId = req.session.uid;
                const basketNumber = await pool.query("select basketId from basket where user_userId = ?", [userId]);
                console.log(basketNumber[0][0]);
                if(basketNumber[0][0] === undefined){
                    const basket = await pool.query("insert into basket(user_userId) values (?)", [userId]);
                    return res.redirect("/");
                }else{
                    return res.redirect("/");
                }
            } else {
                return res.send('<script>alert("패스워드가 틀렸습니다"); location.href="/login"</script>');
            }
        }
    } catch (error) {
        console.log(error);
    }
};
