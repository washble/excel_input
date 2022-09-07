import express, {Request, Response, NextFunction, Router, query} from 'express';
import {DB_Connection} from '../db_connection'

const router = Router();
const db_connection = new DB_Connection();

/* GET home page. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  let query = 'SELECT * FROM category';
  let result = await db_connection.connection_query(query);

  res.render('index', { title: 'Express' });
});

router.post('/get_categorys', async function(req: Request, res: Response, next: NextFunction) {
  let isuSrtCd = req.body.isuSrtCd;
  if(isuSrtCd == undefined) {
    res.status(400).json({error: 'Input Error'});
  } else {
    let query = "SELECT category FROM stocksector WHERE isuSrtCd = ?";
    let result = await db_connection.connection_query(query, isuSrtCd);

    res.status(200).json(result);
  }
})

router.post('/insert_categorys', async function(req: Request, res: Response, next: NextFunction) {
  let isuSrtCd = req.body.isuSrtCd;
  let categorys = req.body.categorys;
  let array_to_json = JSON.parse(req.body.array_to_json);
  
  if(isuSrtCd == undefined || categorys == undefined) {
    res.status(400).json({error: 'Input Error'});
  } else {
    let query = "INSERT INTO stocksector VALUES(?, JSON_ARRAY(?))";
    let result = await db_connection.connection_query(query, [isuSrtCd, array_to_json]);
    if(result == undefined) {
      res.status(400).json({error: 'Input Error'});
    }
    
    query = "INSERT INTO category VALUES(?, JSON_ARRAY(?))";
    for(let i = 0; i < array_to_json.length; i++)
      result = await db_connection.connection_query(query, [array_to_json[i], isuSrtCd]);
    if(result == undefined) {
      res.status(400).json({error: 'Input Error'});
    }
    
    res.status(200).json([{'result':'Success'}]);
  }
})

module.exports = router;
