//import * as mysql from 'mysql2';
import * as mysql from 'mysql2/promise';

export class DB_Connection {
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

    private readonly connection: mysql.Pool;

    constructor() {
        this.connection = mysql.createPool({
            host: 'my_host',
            user: 'my_user',
            password: 'my_password',
            connectionLimit: 4,
            database: 'my_database'
        })

        this.connection.getConnection()
            .then((result: any) => console.log('======DB_Connection: Success======'))
            .catch((result: any) => console.log('======DB_Connection: Failure======'))
    }

    public async connection_query(sql: string) {
        const conn = this.connection.getConnection();
        try {
            const [row] = await (await conn).query(sql);
            console.log(row);
            return row;
        } catch (e: any) {
            throw new Error(e);
        } finally {
            (await conn).release();
        }
    }
}