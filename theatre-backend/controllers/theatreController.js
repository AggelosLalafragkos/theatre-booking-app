const pool = require('../db');

exports.getTheatres = async (req, res) => {
    const { search } = req.query;
    const conn = await pool.getConnection();
    try {
        let rows;
        if (search) {
            rows = await conn.query(
                'SELECT * FROM theatres WHERE name LIKE ? OR location LIKE ?',
                [`%${search}%`, `%${search}%`]
            );
        } else {
            rows = await conn.query('SELECT * FROM theatres');
        }
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching theatres', error: err.message });
    } finally {
        conn.release();
    }
};