import * as mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './.env'});

export class DB_Connection {
    private readonly connection: mysql.Pool;

    constructor() {
        this.connection = mysql.createPool({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            connectionLimit: 4,
            database: process.env.database
        })

        this.connection.getConnection()
            .then(res => console.log('======DB_Connection: Success======'))
            .catch(err => console.log('======DB_Connection: Failure======'))
    }

    public async connection_query(sql: string, values: any = 0) {
        const conn = this.connection.getConnection();
        try {
            const [row] = await (await conn).query(sql, values);
            console.log(row);
            return row;
        } catch (e: any) {
            console.log(e);
        } finally {
            (await conn).release();
        }
    }

    // import * as mysql from 'mysql2';
    // private connection_db() {
    //     let connection = mysql.createConnection({
    //         host: 'my_host',
    //         user: 'my_user',
    //         password: 'my_password',
    //         database: 'my_database'
    //     });

    //     connection.connect(function(err: any) {
    //         if(err)
    //             throw new Error(err);
    //     });
    //     return connection;
    // }

    // public async connection_query(sql: string) {
    //     let connection = this.connection_db();
    //     connection.query(sql, await function(err: any, rows: [], fields: []) {
    //         console.log(rows);
    //         return rows;
    //     })
    //     connection.end();
    // }
}