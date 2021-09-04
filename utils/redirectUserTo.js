export default function redirectUserTo(path, res) {
  res.writeHead(302, { Location: `${path}` });
  res.end();
}
