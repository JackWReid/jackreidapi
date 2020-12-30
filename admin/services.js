import axios from 'axios'

const API_HOST = 'https://api.jackreid.xyz';

export async function getBooks(filter = {}, pagination = {}) {
  const response = await axios.get(API_HOST + '/books/read')
  return response.data;
}
