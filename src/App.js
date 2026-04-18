import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Brain, Activity, Shield, MessageCircle,
  TrendingUp, AlertCircle, Wind, Music, BookOpen
} from 'lucide-react';

// 导航组件
function Navigation({ activeTab, onTabChange, user }) {
  const tabs = [
    { id: 'dashboard', label: '仪表盘', icon: <Activity className="w-5 h-5" /> },
    { id: 'record', label: '记录', icon: <Heart className="w-5 h-5" /> },
    { id: 'chat', label: 'AI聊', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'assessment', label: '评估', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'knowledge', label: '科普库', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'tools', label: '工具包', icon: <Wind className="w-5 h-5" /> },
    { id: 'plan', label: '成长计划', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    window.location.reload();
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              云岫
            </span>
          </div>
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// 登录组件
const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [onAuth, setOnAuth] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const data = isLogin ? { email, password } : { username, email, password };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '认证失败');
      }

      const result = await response.json();
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user_id', result.user_id);
      localStorage.setItem('username', result.username);
      onAuth({
        id: result.user_id,
        username: result.username,
        token: result.access_token
      });
    } catch (err) {
      setError(err.message || '网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">MindGuard</h1>
          <p className="text-slate-500 mt-2">智能心理健康助手</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}

          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={8}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-medium ml-1 hover:underline"
          >
            {isLogin ? '立即注册' : '去登录'}
          </button>
        </p>

        <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-xs text-amber-800 text-center leading-relaxed">
            测试账号：demo@example.com<br/>
            密码：12345678
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// 主应用组件
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟登录状态
  useEffect(() => {
    setUser({
      id: '1',
      username: '测试用户',
      token: 'test-token'
    });
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Brain className="w-12 h-12 mx-auto text-green-500" />
          <p className="mt-4 text-slate-600">加载中...</p>
        </motion.div>
      </div>
    );
  }

  // 未登录显示登录页，登录后显示主内容
  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} user={user} />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <h1 className="text-3xl font-bold text-slate-800">仪表盘</h1>
                <p className="text-slate-600">欢迎回来，{user.username}！这里是你的心理健康仪表盘</p>
              </div>
            )}
            {activeTab === 'record' && (
              <div>
                <h1 className="text-3xl font-bold text-slate-800">情绪记录</h1>
                <p className="text-slate-600">记录你的每日情绪状态</p>
              </div>
            )}
            {activeTab === 'chat' && (
              <div>
                <h1 className="text-3xl font-bold text-slate-800">AI心理聊</h1>
                <p className="text-slate-600">和AI聊聊你的心情</p>
              </div>
            )}
            {activeTab === 'assessment' && (
              <div>
                <h1 className="text-3xl font-bold text-slate-800">心理评估</h1>
                <p className="text-slate-600">完成专业的心理评估量表</p>
              </div>
            )}
            {activeTab === 'knowledge' && (
              <div>
                <h1 className="text-3xl font-bold text-slate-800">科普库</h1>
                <p className="text-slate-600">了解心理健康相关知识</p>
              </div>
            )}
            {activeTab === 'tools' && (
              <div>
                <h1 className="text-3xl font-bold text-slate-800">工具包</h1>
                <p className="text-slate-600">使用心理健康辅助工具</p>
              </div>
            )}
            {activeTab === 'plan' && (
              <div>
                <h1 className="text-3xl font-bold text-slate-800">成长计划</h1>
                <p className="text-slate-600">定制你的心理健康成长计划</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
