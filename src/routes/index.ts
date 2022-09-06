import express, {Request, Response, NextFunction, Router, query} from 'express';
import {DB_Connection} from '../db_connection'

const router = Router();
const db_connection = new DB_Connection();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  let query = 'SELECT * FROM category';
  let result = db_connection.connection_query(query);

  res.render('index', { title: 'Express' });
});

module.exports = router;
