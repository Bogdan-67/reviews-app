import { FC } from 'react';
import HeaderComponent from '../../components/Header';
import { Outlet } from 'react-router';
import { Layout } from 'antd';
import styles from './Layout.module.scss';

const { Header, Content, Sider } = Layout;

const MainLayout: FC = () => {
  return (
    <Layout>
      <Header className={styles.header}>
        <HeaderComponent />
      </Header>
      <Layout hasSider>
        <Sider className={styles.sider}>Sider</Sider>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
