import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { AlertCircle, TrendingUp, Home, Building2, Shield, Brain, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function MortgageAIDemo() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBank, setSelectedBank] = useState('國泰世華');
  const [riskInput, setRiskInput] = useState({
    existingProperties: '0',
    city: '台北市',
    price: '50000000',
    isPresale: false
  });
  const [riskResult, setRiskResult] = useState(null);

  // 模擬資料
  const waterLevelData = [
    { bank: '國泰世華', current: 28.2, predicted: 29.8, alert: 'red' },
    { bank: '中國信託', current: 27.5, predicted: 28.9, alert: 'orange' },
    { bank: '富邦銀行', current: 26.8, predicted: 28.2, alert: 'orange' },
    { bank: '台北富邦', current: 25.9, predicted: 27.1, alert: 'yellow' },
    { bank: '玉山銀行', current: 24.3, predicted: 25.8, alert: 'yellow' },
    { bank: '台灣銀行', current: 22.1, predicted: 23.5, alert: 'green' }
  ];

  const bubbleIndexData = [
    { city: '新竹市', index: 88, change: 18.2, color: '#ef4444' },
    { city: '新竹縣', index: 72, change: 15.8, color: '#f97316' },
    { city: '台中市', index: 65, change: 12.1, color: '#f97316' },
    { city: '桃園市', index: 55, change: 9.5, color: '#eab308' },
    { city: '台南市', index: 42, change: 7.2, color: '#eab308' },
    { city: '高雄市', index: 38, change: 5.8, color: '#22c55e' },
    { city: '新北市', index: 35, change: 4.2, color: '#22c55e' },
    { city: '台北市', index: 28, change: 2.8, color: '#22c55e' }
  ];

  const forecastData = [
    { month: '10月', level: 28.2 },
    { month: '11月', level: 28.8 },
    { month: '12月', level: 29.5 },
    { month: '01月', level: 29.8 },
    { month: '02月', level: 30.2 },
    { month: '03月', level: 30.5 }
  ];

  const performanceData = [
    { metric: '準確率', current: 92, traditional: 75 },
    { metric: '效率', current: 95, traditional: 40 },
    { metric: '成本節省', current: 80, traditional: 0 },
    { metric: '預警能力', current: 88, traditional: 20 }
  ];

  const calculateRisk = () => {
    const existingProps = parseInt(riskInput.existingProperties);
    const price = parseInt(riskInput.price);
    const isPresale = riskInput.isPresale;
    const city = riskInput.city;

    // 基礎成數
    let maxLtv = existingProps === 0 ? 0.80 : existingProps === 1 ? 0.60 : 0.40;
    let riskWeight = 1.0;
    const rules = [];

    // 規則應用
    if (existingProps === 0) {
      rules.push('✅ 首購族: 80%');
    } else if (existingProps === 1) {
      rules.push('⚠️ 第二戶: 60%, 無寬限期');
    } else {
      rules.push('🔴 第三戶以上: 40%');
    }

    // 高價住宅
    if (city === '台北市' && price >= 70000000) {
      maxLtv = Math.min(maxLtv, 0.60);
      rules.push('⚠️ 台北市高價住宅(≥7000萬): 最高60%');
    }
    if (city === '新北市' && price >= 60000000) {
      maxLtv = Math.min(maxLtv, 0.60);
      rules.push('⚠️ 新北市高價住宅(≥6000萬): 最高60%');
    }

    // 預售屋
    if (isPresale) {
      maxLtv *= 0.90;
      rules.push('⚠️ 預售屋: 再打9折');
      riskWeight += 0.15;
    }

    // 區域風險
    const bubbleIndex = bubbleIndexData.find(b => b.city === city)?.index || 50;
    if (bubbleIndex > 70) {
      riskWeight += 0.25;
      rules.push(`🔴 ${city}泡沫高風險區域: 風險權數+0.25`);
    } else if (bubbleIndex > 50) {
      riskWeight += 0.15;
      rules.push(`🟠 ${city}泡沫中風險區域: 風險權數+0.15`);
    }

    // 多戶加成
    if (existingProps >= 2) {
      riskWeight += 0.20;
      rules.push('⚠️ 多戶投資: 風險權數+0.20');
    }

    const suggestedAmount = price * maxLtv;
    const grade = maxLtv >= 0.70 ? 'A' : maxLtv >= 0.55 ? 'B' : maxLtv >= 0.40 ? 'C' : 'D';

    setRiskResult({
      maxLtv: (maxLtv * 100).toFixed(1),
      riskWeight: riskWeight.toFixed(2),
      suggestedAmount: suggestedAmount.toLocaleString('zh-TW'),
      grade,
      rules,
      decision: maxLtv >= 0.50 ? 'APPROVE' : 'CONDITIONAL'
    });
  };

  const getAlertColor = (alert) => {
    const colors = {
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500'
    };
    return colors[alert] || 'bg-gray-500';
  };

  const getAlertIcon = (alert) => {
    if (alert === 'red') return <XCircle className="w-5 h-5" />;
    if (alert === 'orange' || alert === 'yellow') return <AlertTriangle className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-indigo-600">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600 p-3 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">動態房貸風險監理系統</h1>
                <p className="text-sm text-gray-600 mt-1">AI × 法學創新提案 | 智慧監理科技展示</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-800">系統運行中</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl shadow-md p-2 flex space-x-2">
          {[
            { id: 'overview', label: '系統總覽', icon: Home },
            { id: 'waterLevel', label: '72-2水位監控', icon: TrendingUp },
            { id: 'bubbleIndex', label: '區域泡沫指數', icon: AlertCircle },
            { id: 'riskCalc', label: '風險計算器', icon: Shield },
            { id: 'comparison', label: '效益比較', icon: Building2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: '動態風險權數',
                  desc: '依據區域、物件類型、借款人條件動態調整風險權數',
                  value: '1.0 - 2.0',
                  color: 'bg-blue-500',
                  icon: Shield
                },
                {
                  title: '72-2水位預測',
                  desc: '提前3-6個月預警銀行不動產放款水位',
                  value: '88%準確',
                  color: 'bg-purple-500',
                  icon: TrendingUp
                },
                {
                  title: '建商透明化',
                  desc: '公開建商信譽評級,保護購屋者權益',
                  value: '2000+建商',
                  color: 'bg-green-500',
                  icon: Building2
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{feature.desc}</p>
                  <div className="text-2xl font-bold text-indigo-600">{feature.value}</div>
                </div>
              ))}
            </div>

            {/* System Architecture */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">系統架構</h2>
              <div className="space-y-4">
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="font-bold text-blue-900 mb-2">📊 資料整合層</h3>
                  <p className="text-sm text-gray-700">整合內政部實價登錄、金融聯徵中心、央行統計等多元資料源</p>
                </div>
                <div className="flex justify-center">
                  <div className="text-2xl">↓</div>
                </div>
                <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                  <h3 className="font-bold text-purple-900 mb-2">🤖 AI風險引擎</h3>
                  <p className="text-sm text-gray-700">LightGBM違約預測 + LSTM水位預測 + GNN關係網絡 + NLP政策解析</p>
                </div>
                <div className="flex justify-center">
                  <div className="text-2xl">↓</div>
                </div>
                <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                  <h3 className="font-bold text-green-900 mb-2">⚖️ 法規規則引擎 (Law-as-Code)</h3>
                  <p className="text-sm text-gray-700">限貸政策程式化,確保39家銀行執行標準100%一致</p>
                </div>
                <div className="flex justify-center">
                  <div className="text-2xl">↓</div>
                </div>
                <div className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50">
                  <h3 className="font-bold text-indigo-900 mb-2">💼 應用場景介面</h3>
                  <p className="text-sm text-gray-700">銀行合規 | 監理儀表板 | 金融沙盒 | 購屋者保護平台</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'waterLevel' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">全台銀行72-2水位即時監控</h2>
                <div className="text-sm text-gray-500">更新時間: 2025-10-29 10:30</div>
              </div>

              {/* Water Level Table */}
              <div className="overflow-hidden rounded-lg border border-gray-200 mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">銀行</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">當前水位</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">預測3月後</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">警示等級</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">狀態</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {waterLevelData.map((bank, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{bank.bank}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="text-lg font-bold">{bank.current}%</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-bold text-red-600">{bank.predicted}%</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`${getAlertColor(bank.alert)} text-white px-3 py-1 rounded-full text-sm font-medium w-fit flex items-center space-x-1`}>
                            {getAlertIcon(bank.alert)}
                            <span>{bank.alert === 'red' ? '紅燈' : bank.alert === 'orange' ? '橙燈' : bank.alert === 'yellow' ? '黃燈' : '綠燈'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {bank.alert === 'red' && '🚨 緊急煞車'}
                          {bank.alert === 'orange' && '⚠️ 暫緩高風險'}
                          {bank.alert === 'yellow' && '⚡ 提醒控管'}
                          {bank.alert === 'green' && '✅ 正常放款'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Forecast Chart */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">水位預測趨勢 - {selectedBank}</h3>
                <div className="mb-4">
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {waterLevelData.map(bank => (
                      <option key={bank.bank} value={bank.bank}>{bank.bank}</option>
                    ))}
                  </select>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[20, 35]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="level" stroke="#4f46e5" strokeWidth={3} name="水位 (%)" />
                  <Line type="monotone" dataKey={() => 30} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="法定上限 (30%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Alert Box */}
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">🚨 緊急預警</h3>
                  <ul className="space-y-1 text-sm text-red-800">
                    <li>• 國泰世華預估2個月後水位突破30%法定上限</li>
                    <li>• 建議措施: 立即專案金檢、要求提報改善計畫</li>
                    <li>• 建議銀行: 暫緩高風險案件、提高利率0.1-0.2%降低需求</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bubbleIndex' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">台灣六都+竹竹房價泡沫指數</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {bubbleIndexData.map((city, idx) => (
                <div key={idx} className="border-2 rounded-lg p-6 hover:shadow-lg transition-shadow" style={{ borderColor: city.color }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{city.city}</h3>
                    <div className="text-3xl font-bold" style={{ color: city.color }}>
                      {city.index}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">泡沫指數</span>
                      <span className="font-semibold">{city.index}/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">年漲幅</span>
                      <span className="font-semibold text-red-600">+{city.change}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${city.index}%`, backgroundColor: city.color }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium mt-2">
                      {city.index > 70 && <span className="text-red-600">🔴 泡沫高風險</span>}
                      {city.index > 50 && city.index <= 70 && <span className="text-orange-600">🟠 泡沫中風險</span>}
                      {city.index <= 50 && <span className="text-green-600">🟢 正常</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-6">
              <h3 className="text-lg font-bold text-indigo-900 mb-2">💡 AI建議</h3>
              <ul className="space-y-1 text-sm text-indigo-800">
                <li>• 新竹市泡沫指數達88,建議風險權數調升至1.3</li>
                <li>• 建議央行考慮啟動「區域差異化限貸」政策</li>
                <li>• 新竹縣、台中市列入密切關注名單</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'riskCalc' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">動態風險計算器</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">持有戶數</label>
                  <select
                    value={riskInput.existingProperties}
                    onChange={(e) => setRiskInput({...riskInput, existingProperties: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="0">首購族 (0戶)</option>
                    <option value="1">第二戶 (1戶)</option>
                    <option value="2">第三戶 (2戶)</option>
                    <option value="3">第四戶以上 (3戶+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">物件所在縣市</label>
                  <select
                    value={riskInput.city}
                    onChange={(e) => setRiskInput({...riskInput, city: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {bubbleIndexData.map(city => (
                      <option key={city.city} value={city.city}>{city.city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">物件總價 (元)</label>
                  <input
                    type="number"
                    value={riskInput.price}
                    onChange={(e) => setRiskInput({...riskInput, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="例如: 15000000"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={riskInput.isPresale}
                    onChange={(e) => setRiskInput({...riskInput, isPresale: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-700">預售屋</label>
                </div>

                <button
                  onClick={calculateRisk}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  計算風險評級
                </button>
              </div>

              {/* Result */}
              <div>
                {riskResult ? (
                  <div className="space-y-4">
                    <div className={`p-6 rounded-lg ${riskResult.decision === 'APPROVE' ? 'bg-green-50 border-2 border-green-500' : 'bg-yellow-50 border-2 border-yellow-500'}`}>
                      <div className="text-center mb-4">
                        <div className={`text-6xl font-bold ${riskResult.decision === 'APPROVE' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {riskResult.grade}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">風險評級</div>
                      </div>
                      <div className="text-center">
                        <div className={`inline-block px-4 py-2 rounded-full font-bold ${riskResult.decision === 'APPROVE' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {riskResult.decision === 'APPROVE' ? '✅ 建議核准' : '⚠️ 條件式核准'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">最高貸款成數</span>
                        <span className="font-bold text-indigo-600 text-lg">{riskResult.maxLtv}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">動態風險權數</span>
                        <span className="font-bold text-purple-600 text-lg">{riskResult.riskWeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">建議貸款金額</span>
                        <span className="font-bold text-green-600 text-lg">NT$ {riskResult.suggestedAmount}</span>
                      </div>
                    </div>

                    <div className="border-t-2 pt-4">
                      <h3 className="font-bold text-gray-900 mb-3">適用規則</h3>
                      <div className="space-y-2">
                        {riskResult.rules.map((rule, idx) => (
                          <div key={idx} className="text-sm bg-white p-3 rounded-lg border border-gray-200">
                            {rule}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>請輸入資料後點擊「計算風險評級」</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">📊 計算說明</h3>
              <p className="text-sm text-blue-800">
                本計算器依據最新限貸政策與AI風險模型，整合區域泡沫指數、持有戶數、物件類型等多重因子，
                動態計算最適貸款成數與風險權數。所有規則皆符合Law-as-Code標準，確保計算結果的一致性與可稽核性。
              </p>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">AI系統 vs 傳統監理效益比較</h2>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#4f46e5" name="AI系統" />
                  <Bar dataKey="traditional" fill="#9ca3af" name="傳統監理" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Benefits Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💰 量化效益 (年)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-700">監理機關人力節省</span>
                    <span className="font-bold text-green-600">1,200萬</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-700">銀行法遵成本節省</span>
                    <span className="font-bold text-green-600">3.12億</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-700">爛尾樓損失降低</span>
                    <span className="font-bold text-green-600">1.5億</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-green-50 rounded-lg p-3">
                    <span className="font-bold text-gray-900">總計節省</span>
                    <span className="text-2xl font-bold text-green-600">4.6億</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 質化效益</h3>
                <div className="space-y-3">
                  {[
                    { title: '金融穩定', desc: '降低系統性風險,提升國際信評' },
                    { title: '銀行效率', desc: '從被動法遵轉向主動風控' },
                    { title: '居住正義', desc: '炒房客與首購族差異化對待' },
                    { title: '資訊透明', desc: '建商信譽公開,保護購屋權益' },
                    { title: '國際競爭力', desc: 'RegTech技術輸出潛力' }
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">{benefit.title}</div>
                        <div className="text-sm text-gray-600">{benefit.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Innovation Points */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">🌟 四大創新亮點</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: '動態風險權數',
                    desc: '突破一刀切管制,依區域、物件、借款人動態調整 (0.5-2.0)',
                    icon: '🎯'
                  },
                  {
                    title: '72-2水位預測',
                    desc: '提前3-6個月預警,從事後補破網到事前防風險',
                    icon: '🔮'
                  },
                  {
                    title: 'Law-as-Code',
                    desc: '法規程式化,39家銀行執行標準100%一致,72小時更新',
                    icon: '⚖️'
                  },
                  {
                    title: '建商透明化',
                    desc: '公開信譽評級,守護居住正義,降低爛尾樓風險80%',
                    icon: '🏗️'
                  }
                ].map((point, idx) => (
                  <div key={idx} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
                    <div className="text-4xl mb-3">{point.icon}</div>
                    <h4 className="text-lg font-bold mb-2">{point.title}</h4>
                    <p className="text-sm text-white text-opacity-90">{point.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">關於系統</h3>
              <p className="text-gray-400 text-sm">
                AI驅動之動態房貸限貸與風險權數監理科技系統，
                結合人工智慧與法學專業，打造智慧監理新典範。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">核心技術</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• LightGBM/XGBoost 機器學習</li>
                <li>• LSTM 時間序列預測</li>
                <li>• GNN 圖神經網路</li>
                <li>• NLP 自然語言處理</li>
                <li>• SHAP 可解釋AI</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">資料來源</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 內政部實價登錄</li>
                <li>• 金融聯徵中心</li>
                <li>• 央行金融統計</li>
                <li>• 住展建案資料庫</li>
                <li>• 591房屋交易平台</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>© 2025 動態房貸風險監理系統 | AI × 法學創新提案</p>
            <p className="mt-2">本系統為競賽展示用途，所有數據僅供參考</p>
          </div>
        </div>
      </footer>
    </div>
  );
}