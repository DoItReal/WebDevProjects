import express from 'express';
import mongoose from 'mongoose';

import { getAllSigns, deleteSign, updateSign, CreateSign, getSignByID } from '../controllers/signs';

export default (router: express.Router) => {

  router.get('/signs', getAllSigns);
  router.get('/signs/:id', getSignByID);
    router.delete('/signs/:id', deleteSign);
    router.post('/signs/', CreateSign);
  router.patch('/signs/:id', updateSign);
router.put('/signs/:id', updateSign);
};
