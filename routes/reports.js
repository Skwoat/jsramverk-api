const express = require('express');
const router = express.Router();
const db = require("../db/databaseReports.js");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

var jwtSecret = process.env.JWT_SECRET;

if (process.env.NODE_ENV == 'test') {
    jwtSecret = 'testsecret';
}

router.post("/",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => addReport(res, req.body));

router.put("/edit",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => editReports(res, req.body));

router.get("/edit", (req, res) => getReports(res, req.body));

router.get('/week/1', (req, res) => getWeek1(res, req.body));

router.get('/week/2', (req, res) => getWeek2(res, req.body));

router.get('/week/3', (req, res) => getWeek3(res, req.body));

router.get('/week/4', (req, res) => getWeek4(res, req.body));

router.get('/week/10', (req, res) => getWeek10(res, req.body));

function checkToken(req, res, next) {
    var token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, jwtSecret, function(err) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: req.path,
                        title: "Failed authentication",
                        detail: err.message
                    }
                });
            }

            next();

            return undefined;
        });
    } else {
        return res.status(401).json({
            errors: {
                status: 401,
                source: req.path,
                title: "No token",
                detail: "No token provided in request headers"
            }
        });
    }
}

function addReport(res, body) {
    const title = body.title;
    const info = body.info;

    if (!title || !info) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/reports",
                title: "Title or info missing",
                detail: "Title or info missing in request"
            }
        });
    }
    db.run("INSERT INTO reports (title, info) VALUES (?, ?)",
        title,
        info, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/reports",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Info succesfully added."
                }
            });
        }
    );
}

function editReports(res, body) {
    var title = body.title;
    var info = body.info;
    var oldTitle = body.currentOption;

    if (!title || !info) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/reports/edit",
                title: "Title or info missing",
                detail: "Title or info missing in request"
            }
        });
    }

    db.all("UPDATE reports SET title = ?, info = ? WHERE title = ?",
        title,
        info,
        oldTitle, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/reports/edit",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    message: "Info succesfully updated."
                }
            });
        }
    );
}

function getReports(res) {
    var sql = "select * from reports";

    db.all(sql, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json({
            "message": "success",
            "data": rows
        });
    });
}

function getWeek1(res) {
    var sql = "select * from reports";

    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/reports/edit",
                    title: "Database error",
                    detail: err.message
                }
            });
        }
        res.json( { data: rows[0] } );
    });
}

function getWeek2(res) {
    var sql = "select * from reports";

    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/reports/edit",
                    title: "Database error",
                    detail: err.message
                }
            });
        }
        res.json( { data: rows[1] } );
    });
}

function getWeek3(res) {
    var sql = "select * from reports";

    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/reports/edit",
                    title: "Database error",
                    detail: err.message
                }
            });
        }
        res.json( { data: rows[2] } );
    });
}

function getWeek4(res) {
    var sql = "select * from reports";

    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/reports/edit",
                    title: "Database error",
                    detail: err.message
                }
            });
        }
        res.json( { data: rows[3] } );
    });
}

function getWeek10(res) {
    var sql = "select * from reports";

    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/reports/edit",
                    title: "Database error",
                    detail: err.message
                }
            });
        }
        res.json( { data: rows[4] } );
    });
}

module.exports = router;
