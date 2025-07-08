export function verifyApiKey(req, res, next) {
  const key = req.headers['x-api-key'];

  if (!key || key !== process.env.FRONTAPI_KEY) {
    return res.status(401).json({ message: '' });
  }

  next();
}
