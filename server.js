const mysql = require("mysql2")
const express = require("express");
const res = require("express/lib/response");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//database connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'election'
    },
    console.log('Connected to election database')
)
app.get(`/api/candidates`, (req, res) =>{
    const sql = `SELECT * FROM candidates`;

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
app.get(`/api/candidate/:id`, (req, res) =>{
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message:'Success!',
            data: row
        })
    })
})

// Delete a candidate
app.delete(`/api/candidate/:id`, (req, res) =>{
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

// Create a candidate

// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

app.post('/api/candidate', ({body}, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected')
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }
    const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?,?,?,?)`;
    const params = [1, 'Ronald', 'Firbank', 1];
})

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})