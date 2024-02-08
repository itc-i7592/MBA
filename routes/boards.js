const express = require('express');
const router = express.Router();
const ps = require('@prisma/client');
// const {PrismaClient} = require("@prisma/client");
const prisma = new ps.PrismaClient();

const pageSize = 5;

function check(req, res) {
    if (req.session.login == null) {
        req.session.back = '/boards';
        res.redirect('/users/login');
        return true;
    }else {
        return false;
    }
}

router.get('/', (req, res, next) => {
    res.redirect('/boards/0');
});

router.get('/page', (req, res, next) => {
    if (check(req, res)){ return };
    const pg = +req.params.page;
    prisma.Board.findMany({
        skip: pg * pageSize,
        take: pageSize,
        orderBy: [
            {createdAt: 'desc'}
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        const data = {
            title: 'Boards',
            login:req.session.login,
            content: brds,
            page:pg
        }
        res.render('boards/index', data);
    });
});

router.post('/add', (req, res, next) => {
    if (check(req, res)){return}
    prisma.Board.create({
        data:{
            accountId: req.session.login.id,
            message: req.body.msg
        }
    })
        .then(() => {
            res.redirect('/boards')
        })
        .catch((err) => {
            res.redirect('/boards/add');
        })
})
router.get('/home/user/id/page', (req, res, next) => {
    if (check(req, res)){return}
    const id = +req.params.id;
    const pg = +req.params.page;
    prisma.Board.findMany({
        where: {accountId: id},
        skip: pg * pageSize,
        take: pageSize,
        orderBy: [
            {createdAt: 'desc'}
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        const data = {
            title: 'Boards',
            login:req.session.login,
            accountId: id,
            username:req.params.user,
            content: brds,
            page:pg
        }
        res.render('/boards/home', data);
    });
});

module.export = router