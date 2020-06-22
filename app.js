const http = require('http')
const spawn = require('child_process').spawn
const createHandler = require('github-webhook-handler')
const handler = createHandler({
  path: '/',
  secret: 'everyoneknowsnothing'
})

http.createServer((req, res) => {
  handler(req, res, function(err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(10000)

handler.on('error', err => {
  console.error('Error:', err.message)
})

handler.on('push', e => {
  try {
  var branch = e.payload.ref.split('/');
  branch = branch[branch.length-1];
  if (branch != "master") {
    console.log("branch is", branch,",exit deploy!!!");
    return;
  }
  var repoName = e.payload.repository.name;
  var repoSSHUrl = e.payload.repository.ssh_url;
  console.log(branch,repoName,repoSSHUrl)
  const s = spawn('sh', ['./build.sh',repoName,repoSSHUrl])
  s.stdout.on('data', (data) => {
    console.log(`${e.payload.repository.name}: ${data}`);
  })
  s.stderr.on('data', (data) => {
    console.log(`${e.payload.repository.name}: ${data}`);
  });
  console.log(e.payload.repository.name, 'has rebuild');
  } catch (e) {
    console.log(e)
  }
})
