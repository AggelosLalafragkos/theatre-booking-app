const pool = require('../db');

exports.getShows = async (req, res) => {
    const { theatreId, title } = req.query;
    const conn = await pool.getConnection();
    try {
        let query = `SELECT s.*, t.name as theatre_name, t.location
                     FROM shows s JOIN theatres t ON s.theatre_id = t.theatre_id WHERE 1=1`;
        const params = [];

        if (theatreId) { query += ' AND s.theatre_id = ?'; params.push(theatreId); }
        if (title) { query += ' AND s.title LIKE ?'; params.push(`%${title}%`); }

        const rows = await conn.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching shows', error: err.message });
    } finally {
        conn.release();
    }
};

exports.getShowtimes = async (req, res) => {
    const { showId } = req.query;
    const conn = await pool.getConnection();
    try {
        let rows;
        if (showId) {
            rows = await conn.query(
                'SELECT * FROM showtimes WHERE show_id = ? AND available_seats > 0',
                [showId]
            );
        } else {
            rows = await conn.query('SELECT * FROM showtimes WHERE available_seats > 0');
        }
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching showtimes', error: err.message });
    } finally {
        conn.release();
    }
};