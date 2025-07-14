const isDev = import.meta.env.MODE === 'development';

export const microApps = [
    {
      name: 'subApp1', // app name registered
      entry: isDev ? `//${location.hostname}:8001/` : '/subApp1/',
      container: '#subAppContainer',
      activeRule: '/subApp1',
    },
    {
      name: 'subApp2',
      entry: isDev ? `//${location.hostname}:8002/${import.meta.env.VITE_SUB_APP_NAME}/` : '/subApp2/',
      container: '#subAppContainer',
      activeRule: '/subApp2',
    },
]