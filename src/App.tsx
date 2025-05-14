import { App as AntdApp, ConfigProvider, theme } from "antd";
import { AppRouter } from "./app-routes/app-routes";

const { defaultAlgorithm } = theme;
const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
        algorithm: defaultAlgorithm,
        cssVar: true,
        token: {},
        components: {},
      }}
    >
      <AntdApp>
        <AppRouter />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
