//https://itnext.io/a-tagged-template-literals-utility-for-ease-of-composing-parameterized-sql-queries-f507e159466e
const {Client} = require('pg')
const dotenv = require('dotenv')

dotenv.config({path: './.env'})

async function main(args) {

    // console.log(args)
    // console.log(process.env.PG_HOST)
    // console.log(process.env.PG_DATABASE)
    // console.log(process.env.PG_PORT)
    // console.log(process.env.PG_USER)
    // console.log(process.env.PG_PASSWORD)

    const client = new Client({
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      ssl: {
        rejectUnauthorized: false
      }
    });

  let failure = null;

    await client.connect()
    .catch((err) => failure = err );

  if (failure !== null) {
    console.log(`Response: ${failure}`)
    return {body: failure};
  }
  const data = JSON.parse(args.__ow_body)

   const response = await client.query(`INSERT INTO company (username, age, date) VALUES ('${data.username}', ${data.age}, current_timestamp)`)
   .catch(reason => failure = reason);

  await client.end();

  const body = failure === null ? "Data inserted successfully" : failure.toString();

  console.log(`Response: ${body}`)

  return {body};
}

exports.main = main