import Head from 'next/head'
import { Layout, Menu } from 'antd'
import 'antd/dist/antd.css'
import styles from '../styles/Home.module.css'

const { Header, Content, Sider } = Layout;

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">Books</Menu.Item>
          <Menu.Item key="3">Films</Menu.Item>
        </Menu>
      </Sider>

      <Content style={{padding: '16px'}}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </h1>
        </main>
      </Content>
    </Layout>
  )
}
