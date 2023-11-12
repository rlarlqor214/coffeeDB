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
                console.log(req.session);
                return res.redirect("/");
            } else {
                return res.send('<script>alert("패스워드가 틀렸습니다"); location.href="/login"</script>');
            }
        }
    } catch (error) {
        console.log(error);
    }
};
