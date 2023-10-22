import { FC } from 'react';
import HeaderComponent from '../../components/Header';
import SiderComponent from '../../components/Sider';
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
        <Sider className={styles.sider}>
          <SiderComponent />
        </Sider>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
