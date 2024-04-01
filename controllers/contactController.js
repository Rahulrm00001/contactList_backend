const asynHandler = require('express-async-handler')
const Contact = require('../models/contactModel')


const getsController = async (req, res) => {
    const search = req.query.search || '';
    const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) : 1; // Default page set to 1
    const itemsPerPage = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage) : 5; // Default limit set to 10
 
    try {
      const matchStage = {};
  
      if (search) {
        matchStage.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }
  
      const aggregationPipeline = [
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            contacts: [
              { $project: { _id: 1,name: 1, email: 1, phone: 1 } },
              { $skip: (currentPage - 1) * itemsPerPage },
              { $limit: itemsPerPage },
            ],
            totalCount: [
              { $count: 'count' }
            ],
          }
        },
        {
          $project: {
            contacts: 1,
            totalCount: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
          }
        }
      ];
  
      const result = await Contact.aggregate(aggregationPipeline);
     
      const { contacts, totalCount } = result[0];
  
      res.status(200).json({ contacts, totalCount });
    } catch (error) {
      console.error(`Error in fetching contacts: ${error.message}`);
      res.status(500).json({ error: error.message }); 
    }
  };
  

  
  

//post method
const createController = asynHandler(async (req, res) => {
   
    const { name, phone, email } = req.body
    if (!name || !phone || !email) {
        res.status(400)
        throw new Error("All felid are mandatory")
    }
    const contact = await Contact.create({
        name,
        phone,
        email
    })
    res.status(200).json(contact)
})

//get method
const getController = asynHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
        res.status(404)
        throw new Error('Contact not Found')
    }
    res.status(200).json(contact)
})

//update(put method)
const updateContact = asynHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
        res.status(404)
        throw new Error("Contact not found")
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    res.status(200).json(updatedContact)
})

//delete contact
const deleteContact = asynHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
        res.status(404)
        throw new Error("Contact not founded")
    }
    await Contact.findByIdAndDelete({ _id: req.params.id })
    res.status(200).json(contact)
})




module.exports = { getsController,
                   createController, 
                   getController, 
                   updateContact, 
                   deleteContact ,
                }