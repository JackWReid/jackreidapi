import Head from 'next/head'
import { useRouter } from 'next/router'
import { Table } from 'antd'

import {getBooks} from '../services'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
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
  const router = useRouter();

  return (
    <div>
    <Head>
      <title>Books</title>
    </Head>

    <Table
      dataSource={books}
      columns={columns}
      onRow={record => ({onClick: () => router.push(`/book/${record.id}`)})}
    />

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
