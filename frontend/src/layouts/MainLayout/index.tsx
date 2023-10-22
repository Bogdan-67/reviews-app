import { FC } from 'react';
import HeaderComponent from '../../components/Header/Header';
import SiderComponent from '../../components/Sider/Sider';
import { Outlet } from 'react-router';
import { Layout } from 'antd';
import styles from './Layout.module.scss';

const { Header, Content, Sider } = Layout;

const MainLayout: FC = () => {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <HeaderComponent />
      </Header>
      <Layout hasSider className={styles.layoutContent}>
        <div className={styles.layoutContent2}>
          <Sider className={styles.sider}>
            <SiderComponent />
          </Sider>
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </div>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
