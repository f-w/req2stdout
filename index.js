const http = require('http');
const port = 3000;

function printDateInISOWithTimezone(date) {
  const timezoneOffset = date.getTimezoneOffset();
  const offsetDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);
  const isoString = offsetDate.toISOString();
  const timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const timezoneMinutes = Math.abs(timezoneOffset) % 60;
  const timezoneSign = timezoneOffset < 0 ? '+' : '-';
  const formattedTimezone =
    timezoneOffset === 0
      ? 'Z'
      : `${timezoneSign}${String(timezoneHours).padStart(2, '0')}:${String(
          timezoneMinutes
        ).padStart(2, '0')}`;

  return `${isoString.substring(0, isoString.length - 1)}${formattedTimezone}`;
}

const server = http.createServer((req, res) => {
  // Skip logging for probe endpoint
  if (req.url !== '/_probe') {
    console.log('\n=== Incoming Request ===');
    console.log('Time:', printDateInISOWithTimezone(new Date()));
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:');
    console.log(JSON.stringify(req.headers, null, 2));

    let body = [];

    req.on('data', (chunk) => {
      body.push(chunk);
    });

    req.on('end', () => {
      body = Buffer.concat(body);
      if (body.length) {
        console.log(`Body Length: ${body.length}`);
        console.log('Body:');
        console.log(body.toString());
      } else {
        console.log('<No body content>');
      }
    });
  }

  // Send response
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Request received and logged');
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
