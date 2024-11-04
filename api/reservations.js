const express = require("express");
const reservationsRouter = express.Router();

const { requireUser } = require("./utils");

const {
  getReservation,
  getUsersReservations,
  deleteReservation,
  updateBook,
  getBook,
} = require("../db");

reservationsRouter.get("/", requireUser, async (req, res, next) => {
  try {
    const reservations = await getUsersReservations(req.user.id);
    console.log(reservations);
    res.send("reservations here");
  } catch (err) {
    next(err);
  }
});

reservationsRouter.delete("/:id", requireUser, async (req, res, next) => {
  try {
    // first check if a reservation with that id exists
    const reservation = await getReservation(req.params.id);
    console.log("RESERVATION", reservation);

    // if not, throw an error with message - reservation does not exist - STOP
    if (!reservation) {
      next({
        name: "ReservationDoesNotExist",
        message: "Nothing to return here...",
      });
      return;
    } else if (req.user.id !== reservation.userid) {
      // IF reservation is there, check the reservation's userid against the logged-in user's id
      // -- If they don't match, throw an error - not authorized to return this book
      next({
        name: "Permission Denied",
        message: "You do not have permission to return this book",
      });
      return;
    } else {
      // -- if they DO match, two things - delete the reservation (using deleteReservation function), confirm
      // ---that the deletion was successful AND THEN update the book to be available again (set available:true);
      const deletedReservation = await deleteReservation(req.params.id);
      const book = await getBook(deletedReservation.bookid);
      if (deletedReservation) {
        updateBook(book.id, true);
      }
      res.send({ deletedReservation });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = reservationsRouter;
