const express = require("express");
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

//Get all candidates
router.get(`/candidates`, (req, res) =>{
    const sql = `SELECT candidates.*, parties.name AS party_name
    FROM candidates
    LEFT JOIN parties ON candidates.party_id = parties.id;`;

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

// Get a single candidate
router.get(`/candidate/:id`, (req, res) =>{
    const sql = `SELECT candidates.*, parties.name AS party_name
    FROM candidates
    LEFT JOIN parties ON candidates.party_id = parties.id
    WHERE candidates.id = ?;`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        if (!row.length) {
            res.json({
                message: 'Candidate not found'
            })
        } else {
            res.json({
                message:'Success!',
                data: row
            })
        }
    })
})

//create a candidate
router.post('/candidate', ({body}, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected')
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Candidate added',
            data: body
        })
    })
})

// Update a candidate's party
router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }

    const sql = `UPDATE candidates SET party_id = ? WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({error: err.message});
        } else if (!results.affectedRows) {
            res.json({
                message: 'Candidate not found'
            })
        } else {
            res.json({
                message:'Candidate party changed',
                data: req.body,
                changes: results.affectedRows,
            })
        }
    })
})

// Delete a candidate
router.delete(`/candidate/:id`, (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({error: err.message});
        } else if (!results.affectedRows) {
            res.json({
                message: 'Candidate not found'
            })
        } else {
            res.json({
                message:'Candidate deleted',
                changes: results.affectedRows,
                id: req.params.id
            })
        }
    })
})


module.exports = router;