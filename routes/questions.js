const Joi = require('joi');
const db = require('../db/mysql');
const express = require('express');
const router = express.Router();

router.get('/:event_id', async (req, res) => {
    const event_id = req.params.event_id;

    const schema = Joi.object({
        event_id: Joi.string().required()
    });

    const result = schema.validate({event_id: event_id});
    if (result.error) return res.sendStatus(400);

    try {
        const results = await db.all(event_id);
        return res.json(results);

        // if (results.length !== 0) return res.json(results);
        // return res.sendStatus(404);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {

    const schema = Joi.object({
        question: Joi.string().min(3).max(512).required(),
        event_id: Joi.string().required()
    });

    const question = req.body;

    const result = schema.validate(question);

    if (result.error) return res.status(400).send(result.error.details[0].message);

    try {
        const result = await db.insert(question);
        if (result.insertId) return res.json(result);
        return res.sendStatus(400);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;

    const schema = Joi.object({
        id: Joi.string().required()
    });

    const result = schema.validate({id: id});
    if (result.error) return res.sendStatus(400);

    try {
        const result = await db.incrementVote(id);
        if (result.changedRows) return res.json(result);
        return res.sendStatus(400);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

module.exports = router;