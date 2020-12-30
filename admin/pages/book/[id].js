import Head from 'next/head';
import {getBooks} from '../../services'

export default function BookEdit({ book }) {
  return (
    <div>
      <Head>
        <title>{book.title} by {book.author} | Book</title>
      </Head>
      <div>
        {JSON.stringify(book)}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const books = await getBooks();

  const book = books.find(b => b.id === Number(context.params.id)) || {};

  if (!books || !book) {
    return {
      notFound: true,
    }
  }

  return {
    props: {book},
  }
}
