import { parse } from 'csv-parse';
import fs from 'node:fs'
import { title } from 'node:process';

(async () => {
  // Create parser structure
  const csvParser = parse({
    delimiter: ',',
    skip_empty_lines: true,
    fromLine: 2,
  });
  // Create the parser
  const data_url = new URL('./data.csv', import.meta.url)
  const parser = fs.createReadStream(data_url).pipe(csvParser);
  // Report start
  console.log('Iniciando stream');
  // Iterate through each records
  for await (const record of parser) {
    const [title, description]  = record
    try {
      console.log('inserindo task: ', title)
      fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
      }).then(res => {
        console.log(res.status, title)
      })
    } catch (error) {
      console.log(error)
    }
  }
  // Report end
  console.log('Stream Finalizado!');
})();
