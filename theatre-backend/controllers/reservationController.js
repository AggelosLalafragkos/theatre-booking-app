const pool = require('../db');

exports.createReservation = async (req, res) => {
    const { showtime_id, tickets } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const showtimes = await conn.query(
            'SELECT * FROM showtimes WHERE showtime_id = ? FOR UPDATE', [showtime_id]
        );
        if (showtimes.length === 0) {
            await conn.rollback();
            return res.status(404).json({ message: 'Showtime not found' });
        }

        const showtime = showtimes[0];
        if (showtime.available_seats < tickets) {
            await conn.rollback();
            return res.status(400).json({ message: 'Not enough available seats' });
        }

        const total_price = showtime.price * tickets;

        await conn.query(
            'INSERT INTO reservations (user_id, showtime_id, tickets, total_price) VALUES (?, ?, ?, ?)',
            [req.userId, showtime_id, tickets, total_price]
        );

        await conn.query(
            'UPDATE showtimes SET available_seats = available_seats - ? WHERE showtime_id = ?',
            [tickets, showtime_id]
        );

        await conn.commit();
        res.status(201).json({ message: 'Reservation created successfully', total_price });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ message: 'Error creating reservation', error: err.message });
    } finally {
        conn.release();
    }
};

exports.getUserReservations = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const rows = await conn.query(
            `SELECT r.*, s.title as show_title, st.show_date, st.show_time,
                    st.price, t.name as theatre_name
             FROM reservations r
             JOIN showtimes st ON r.showtime_id = st.showtime_id
             JOIN shows s ON st.show_id = s.show_id
             JOIN theatres t ON s.theatre_id = t.theatre_id
             WHERE r.user_id = ? ORDER BY r.created_at DESC`,
            [req.userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reservations', error: err.message });
    } finally {
        conn.release();
    }
};

exports.cancelReservation = async (req, res) => {
    const { id } = req.params;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const reservations = await conn.query(
            'SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ? FOR UPDATE',
            [id, req.userId]
        );
        if (reservations.length === 0) {
            await conn.rollback();
            return res.status(404).json({ message: 'Reservation not found' });
        }

        const reservation = reservations[0];

        await conn.query(
            'UPDATE showtimes SET available_seats = available_seats + ? WHERE showtime_id = ?',
            [reservation.tickets, reservation.showtime_id]
        );

        await conn.query(
            'DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?',
            [id, req.userId]
        );

        await conn.commit();
        res.json({ message: 'Reservation cancelled successfully' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ message: 'Error cancelling reservation', error: err.message });
    } finally {
        conn.release();
    }
};
