import { useRouter } from 'next/router'
import Link from 'next/link'

import { Layout, Menu } from 'antd'
import 'antd/dist/antd.css'
import '../styles/globals.css'

const { Header, Content, Sider } = Layout;

const getMenuKey = pathname => {
  console.log({pathname});
  if (pathname === '/') {
    return ['1']
  }
  if (pathname === '/books') {
    return ['2']
  }
  if (pathname === '/films') {
    return ['3']
  }
  return []
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <Layout>
      <Sider width={200}>
        <Menu
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
        selectedKeys={getMenuKey(router.pathname)}
        >
          <Menu.Item key="1"><Link href="/">Home</Link></Menu.Item>
          <Menu.Item key="2"><Link href="/books">Books</Link></Menu.Item>
          <Menu.Item key="3"><Link href="/films">Films</Link></Menu.Item>
        </Menu>
      </Sider>

      <Content style={{padding: '16px'}}>
        <Component {...pageProps} />
      </Content>
    </Layout>
  )
}

export default MyApp
