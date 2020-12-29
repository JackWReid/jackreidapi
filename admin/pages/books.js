import Head from 'next/head'
import { Table } from 'antd'

import 'antd/dist/antd.css'

import {getBooks} from '../services'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: 'Date',
    dataIndex: 'date_updated',
    key: 'date',
  }
];

export default function Books({ books }) {
  return (
    <div>
    <Head>
      <title>Books</title>
    </Head>

    <Table dataSource={books} columns={columns} />

    </div>
  );
}

export async function getServerSideProps(context) {
  const books = await getBooks();

  if (!books) {
    return {
      notFound: true,
    }
  }

  return {
    props: {books},
  }
}
