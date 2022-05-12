const express = require("express");
const router = express.Router();
const db = require('../../db/connection');

//Get all parties
router.get(`/parties`, (req, res) =>{
    const sql = `SELECT * FROM parties;`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message:'Success!',
            data: rows
        })
    })
})

// Get a single party
router.get(`/party/:id`, (req, res) =>{
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        if (!row.length) {
            res.json({
                message: 'Party not found'
            })
        } else {
            res.json({
                message:'Success!',
                data: row
            })
        }
    })
})

// Delete a party
router.delete(`/party/:id`, (req, res) =>{
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({error: err.message});
        } else if (!results.affectedRows) {
            res.json({
                message: 'Party not found'
            })
        } else {
            res.json({
                message:'Party deleted',
                changes: results.affectedRows,
                id: req.params.id
            })
        }
    })
})


module.exports = router;