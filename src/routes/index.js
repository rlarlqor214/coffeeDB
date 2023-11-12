var express = require('express');
var router = express.Router();

const indexController = require("../controllers/indexController");
const createController = require("../controllers/createController");
const loginController = require("../controllers/loginController");
const menuController = require("../controllers/menuController");
const menudetailController = require("../controllers/menudetailController");
const basketController = require("../controllers/basketController");
const searchController = require("../controllers/searchController");
const orderController = require("../controllers/orderController");

//메인페이지
router.get("/", indexController.render);

//회원가입 페이지
router.get("/create", createController.renderCreate);
router.post("/create/signup" , createController.signup);

//로그인 페이지
router.get("/login" , loginController.renderLogin);
router.post("/login", loginController.login);

//메뉴 페이지
router.get("/menu" , menuController.rendermenu);
router.post("/search", menuController.searchmenu);

//메뉴 검색 페이지
router.get("/search", searchController.renderSearchmenu);

//관리자 메뉴 추가,삭제 페이지
router.get("/addmenu", menuController.renderAddmenu);
router.post("/addmenu", menuController.addMenu);
router.post("/menudelete", menuController.deleteMenu);

//메뉴 상세페이지
router.get("/detail/:id", menudetailController.rendermenuDetail);

//장바구니 페이지
router.get("/basket", basketController.renderBasket);
router.post("/addToBasket", basketController.addToCart);
router.post("/basket/update", basketController.updateBasket);
router.post("/basket/delete", basketController.deleteBasket);
//결재 페이지
router.get("/order", orderController.renderOrder);
router.post("/pieceOrder", orderController.pieceOrder);
router.post("/order", orderController.remove);

module.exports = router;