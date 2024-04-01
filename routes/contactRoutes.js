const express = require('express')
const router = express.Router()
const { getsController,
        createController,
        getController,
        updateContact,
        deleteContact, 
        } = require('../controllers/contactController')

router.route('/').get(getsController)

router.route('/').post(createController)

router.route('/:id').get(getController)

router.route('/:id').put(updateContact)

router.route('/:id').delete(deleteContact)


module.exports = router