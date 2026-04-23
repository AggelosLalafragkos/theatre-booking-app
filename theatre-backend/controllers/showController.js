const pool = require('../db');

exports.getShows = async (req, res) => {
    const { theatreId, title } = req.query;
    try {
        const conn = await pool.getConnection();
        let query = `SELECT s.*, t.name as theatre_name, t.location 
                     FROM shows s JOIN theatres t ON s.theatre_id = t.theatre_id WHERE 1=1`;
        const params = [];

        if (theatreId) { query += ' AND s.theatre_id = ?'; params.push(theatreId); }
        if (title) { query += ' AND s.title LIKE ?'; params.push(`%${title}%`); }

        const rows = await conn.query(query, params);
        conn.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching shows', error: err.message });
    }
};

exports.getShowtimes = async (req, res) => {
    const { showId } = req.query;
    try {
        const conn = await pool.getConnection();
        let rows;
        if (showId) {
            rows = await conn.query(
                'SELECT * FROM showtimes WHERE show_id = ? AND available_seats > 0',
                [showId]
            );
        } else {
            rows = await conn.query('SELECT * FROM showtimes WHERE available_seats > 0');
        }
        conn.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching showtimes', error: err.message });
    }
};