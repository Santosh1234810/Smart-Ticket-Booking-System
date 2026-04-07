const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const {
	createBooking,
	getBookings,
	getBookingById,
	getBookedSeats,
	cancelBooking,
	requestResale,
	getMyResaleTickets,
	removeResaleTicket,
	getPendingResaleTickets,
	approveResaleTicket,
	rejectResaleTicket,
} = require('../controllers/bookingController');

router.use(verifyToken);
router.post('/', createBooking);
router.get('/', getBookings);
router.get('/occupied', getBookedSeats);
router.get('/resale/my', getMyResaleTickets);
router.post('/:id/resale', requestResale);
router.delete('/resale/:id', removeResaleTicket);
router.get('/resale/pending', requireAdmin, getPendingResaleTickets);
router.put('/resale/:id/approve', requireAdmin, approveResaleTicket);
router.put('/resale/:id/reject', requireAdmin, rejectResaleTicket);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
