const express = require('express');
const {PrismaClient} = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Hello');
});

router.get('/login', (req, res, next) => {
    const data = {
        title: "Users/Login",
        content: "名前とパスワードを入力してください。"
    };
    res.render('users/login', data);
})

router.post('/login', (req, res, next) => {
    prisma.user.findMany({
        where: {
            name: req.body.name,
            pass: req.body.pass,
        }
    }).then(usr => {
        if (usr != null && usr[0] != null) {
            req.session.login = usr[0];
            let back = req.session.back;
            if (back == null) {
                back = '/';
            }
            res.redirect(back);
        } else {
            const data = {
                title: 'Users/Login',
                content: '名前化パスワードに問題があります。再入力してください'
            }
            res.render('users/login', data)
        }
    })
});
module.exports = router;


// router.get('/signin', async (req, res, next) => {
//   try {
//     const users = await prisma.user.findMany();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({msg: error.msg});
//   }
// });
//
// router.post("/signin", passport.authenticate("local", {
//   successReturnToOrRedirect: "/",
//   failureFlash: "/SignIn",
//   failureMessage: true,
//   keepSessionInfo: true
// }))