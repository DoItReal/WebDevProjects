import express from 'express';

import signs from './signs';

const router = express.Router();

export default (): express.Router => {
  signs(router);

  return router;
};
