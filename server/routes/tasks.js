const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.use(express.json());

// Create a tasks
router.post("/create", authorization, (req, res) => {
  let body = req.body;
  let userId = req.user.id;
  let {
    title: eventTitle,
    description: eventDescription,
    startDate: eventStartDate,
    endDate: eventEndDate,
    deleted,
    type: eventType,
  } = req.body;

  if (
    !body.hasOwnProperty("title") ||
    !body.hasOwnProperty("description") ||
    !body.hasOwnProperty("startDate") ||
    !body.hasOwnProperty("endDate") ||
    !body.hasOwnProperty("type")
  ) {
    return res.sendStatus(400);
  }

  pool
    .query(
      "INSERT INTO planner.Events(user_id, title, description, start_date, end_date, deleted, type) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        userId,
        eventTitle,
        eventDescription,
        eventStartDate,
        eventEndDate,
        deleted,
        eventType,
      ]
    )
    .then((response) => {
      res.status(200).json(response.rows[0]);
    })
    .catch((error) => {
      res.sendStatus(500);
    });
});

// Display all tasks for a user
router.get("/", authorization, (req, res, next) => {
  let body = req.body;
  let userId = req.user.id;

  pool
    .query(
      "SELECT u.username, e.event_id, e.title, e.description, e.start_date, e.end_date, e.deleted, e.type FROM planner.Users AS u LEFT JOIN planner.Events AS e ON u.user_id = e.user_id WHERE u.user_id = $1",
      [userId]
    )
    .then((response) => {
      res.status(200).json({ events: response.rows });
    })
    .catch((error) => {
      res.sendStatus(500);
    });
});

// Display a task
router.get("/:eventId", authorization, (req, res) => {
  let { eventId } = req.params;
  let userId = req.user.id;

  pool
    .query("SELECT * FROM planner.Events WHERE event_id = $1 AND user_id = $2", [
      eventId,
      userId,
    ])
    .then((response) => {
      if (response.rows.length === 0) {
        return res.status(403).json({"error": "Event does not exist"})
      }
      res.status(200).json(response.rows[0]);
    })
    .catch((error) => {
      res.sendStatus(500);
    });
});

// Edit/Update a task
router.put("/edit/:eventId", authorization, (req, res) => {
  let { eventId } = req.params;
  let userId = req.user.id;
  let {
    title: eventTitle,
    description: eventDescription,
    startDate: eventStartDate,
    endDate: eventEndDate,
    type: eventType,
  } = req.body;

  pool
    .query(
      "UPDATE planner.Events SET title = $1, description = $2, start_date = $3, end_date = $4, type = $5 WHERE event_id = $6 AND user_id = $7 RETURNING *",
      [
        eventTitle,
        eventDescription,
        eventStartDate,
        eventEndDate,
        eventType,
        eventId,
        userId,
      ]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return res.status(403).json({ error: "Event does not exist" });
      }
      return res.status(200).json(response.rows[0]);
    })
    .catch((error) => {
      console.log(error.message);
      res.sendStatus(500);
    });
});

// Delete a task
router.delete("/:eventId", authorization, (req, res) => {
  let { eventId } = req.params;
  let userId = req.user.id;

  pool
    .query("DELETE FROM planner.Events WHERE event_id = $1 AND user_id = $2", [
      eventId,
      userId,
    ])
    .then((response) => {
      res.status(200).json({ message: "Successfully deleted event!" });
    })
    .catch((error) => {
      res.sendStatus(500);
    });
});

module.exports = router;