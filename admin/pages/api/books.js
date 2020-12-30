// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'

const API_HOST = 'https://api.jackreid.xyz';

export default (req, res) => {
  if (req.method === 'GET') {
    const response = await axios.get(API_HOST + '/books/read')
    res.statusCode = 200
    return res.json(response.data);
  }

  if (req.method === 'GET') {
    res.statusCode = 200
    return res.json({ message: 'GET a book' })
  }

  if (req.method === 'PATCH') {
    res.statusCode = 200
    return res.json({ message: 'PATCH a book' })
  }

  if (req.method === 'DELETE') {
    res.statusCode = 200
    return res.json({ message: 'DELETE a book' })
  }

  res.statusCode = 404
  res.json({ message: 'Internal API not found' })
}
