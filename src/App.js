import { Layout, Menu } from 'antd';
import { Router, Link, useLocation } from '@reach/router';
import { SearchResults, Notebooks, NotebookItem } from './screens';

const { Header, Content } = Layout;

const Stats = () => <h1>Stats</h1>;

function App() {
  const { pathname } = useLocation();

  return (
    <Layout>
      <Header className="site-layout-background" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Menu theme="dark" mode="horizontal" selectedKeys={[pathname.substr(1).split('/')[0]]}>
            <Menu.Item key="search" isSelected={pathname === '/search'}>
              <Link to="/search">
                Search
              </Link>
            </Menu.Item>
            <Menu.Item key="notebooks">
              <Link to="/notebooks" isCurrent={pathname === '/notebooks'}>
                Notebooks
              </Link>
            </Menu.Item>
            <Menu.Item key="stats">
              <Link to="/stats">
                Stats
              </Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content
        className="site-layout"
        style={{
          position: 'fixed',
          width: '100vw',
          height: 'calc(100vh - 64px)',
          top: '64px',
        }}
      >
        <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '40px' }}>
          <Router defaultValue="/search">
            <SearchResults path="/search" />
            <div path="/notebooks">
              <Notebooks path="/" />
              <NotebookItem path="/:id" />
            </div>
            <Stats path="/stats" />
          </Router>
        </div>
      </Content>
    </Layout>
  );
}

export { App };
