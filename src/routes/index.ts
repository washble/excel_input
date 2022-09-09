import express, {Request, Response, NextFunction, Router, query} from 'express';
import {DB_Connection} from '../db_connection'

const router = Router();
const db_connection = new DB_Connection();

/* GET home page. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
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
  let array_to_json = req.body.array_to_json;
  let delete_array = req.body.delete_array;
  let add_array = req.body.add_array;
  
  if(isuSrtCd == undefined || array_to_json == undefined) {
    res.status(400).json({error: 'Input Error'});
  } else {
    array_to_json = JSON.parse(array_to_json);
    delete_array = JSON.parse(delete_array);
    add_array = JSON.parse(add_array);

    // transction
    const conn = db_connection.get_connection();
    try {
      (await conn).beginTransaction();

      // Insert or Update
      let query = "INSERT INTO stocksector VALUES(?, JSON_ARRAY(?)) ON DUPLICATE KEY UPDATE category=JSON_ARRAY(?)";
      let result = await db_connection.transaction_conn_query(conn, query, [isuSrtCd, array_to_json, array_to_json]);

      // Delete
      let get_isuSrtCd_query = "SELECT isuSrtCd FROM category WHERE category = ?";
      let temp_get_result: any;
      let temp_json_array: string[] = [];
      query = "UPDATE category SET isuSrtCd=JSON_ARRAY(?) WHERE category=?";
      for(let i = 0; i < delete_array.length; i++) {
        temp_get_result = await db_connection.transaction_conn_query(conn, get_isuSrtCd_query, delete_array[i]);
        if(temp_get_result.length > 0) {
          temp_json_array = temp_get_result[0].isuSrtCd;
        }
        for(let j = 0; j < temp_json_array.length; j++) {
          if(temp_json_array[j] == isuSrtCd) {
            temp_json_array.splice(j, 1);
            break;
          }
        }
        result = await db_connection.transaction_conn_query(conn, query, [temp_json_array, delete_array[i]]);
      }

      // Add
      query = "INSERT INTO category VALUES(?, JSON_ARRAY(?)) ON DUPLICATE KEY UPDATE isuSrtCd=JSON_ARRAY(?)";
      for(let i = 0; i < add_array.length; i++) {
        if(add_array[i] == '' || add_array[i] == undefined) break;

        temp_get_result = await db_connection.transaction_conn_query(conn, get_isuSrtCd_query, add_array[i]);
        if(temp_get_result.length > 0) {
          temp_json_array = temp_get_result[0].isuSrtCd;
          temp_json_array.push(isuSrtCd);
        }
        else {
          temp_json_array = [isuSrtCd];
        }
        result = await db_connection.transaction_conn_query(conn, query, [add_array[i], temp_json_array, temp_json_array]);
      }
      
      (await conn).commit();
      res.status(200).json([{'result':'Success'}]);
    } catch(err: any) {
      (await conn).rollback()
      return res.status(500).json(err)
    } finally {
      (await conn).release();
    }
  }
})

module.exports = router;
