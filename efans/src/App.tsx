import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Info, Shield, ExternalLink, Users, Globe, Github, MessageCircle } from 'lucide-react'
import { cn } from './lib/utils'
import { AvatarImage } from './lib/avatarService'

interface TabProps {
  id: string
  label: string
  icon: React.ReactNode
  isActive: boolean
  onClick: () => void
}

interface ContentProps {
  isActive: boolean
  children: React.ReactNode
}

const Tab: React.FC<TabProps> = ({ label, icon, isActive, onClick }) => (
  <motion.button
    className={cn(
      "flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium rounded-t-xl transition-all duration-300",
      "glass-button relative overflow-hidden",
      isActive 
        ? "text-blue-600 dark:text-blue-400 shadow-lg" 
        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
    )}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {icon}
    {label}
    {isActive && (
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
        layoutId="activeTab"
        initial={false}
        transition={{ type: "spring", bounce: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />
    )}
  </motion.button>
)

const Content: React.FC<ContentProps> = ({ isActive, children }) => (
  <AnimatePresence mode="wait">
    {isActive && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="p-8 glass-card liquid-shadow dark:liquid-shadow-dark rounded-b-2xl min-h-[400px]"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)

const InfoContent = () => (
  <div className="space-y-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-wrap gap-4"
    >
      <a
        href="https://t.me/exteraFans"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 glass-button rounded-xl hover:scale-105 transition-transform"
      >
        <ExternalLink className="w-5 h-5 text-blue-500" />
        <span>Телеграм exteraFans</span>
      </a>
      <a
        href="https://t.me/exteraGram"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 glass-button rounded-xl hover:scale-105 transition-transform"
      >
        <ExternalLink className="w-5 h-5 text-green-500" />
        <span>Бот exteraGram</span>
      </a>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-4"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-3 p-4 glass-button rounded-xl"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">1</div>
        <p>В сообщении обязательно должен быть твой <code className="px-2 py-1 bg-blue-500/20 rounded">@username</code></p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-3 p-4 glass-button rounded-xl"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">2</div>
        <p>Текст после юзернейма не должен превышать 25 символов</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-3 p-4 glass-button rounded-xl"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">3</div>
        <p>Без жести — заявка будет отклонена автоматически</p>
      </motion.div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="p-6 glass-button rounded-xl"
    >
      <h3 className="text-lg font-semibold mb-3">Пример:</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        <code className="px-2 py-1 bg-gray-800/50 rounded">[Текст твоей заявки] @твой_username {'{доп. инфо}'}</code>
      </p>
      <p className="text-xs text-gray-500">
        <em>[] — обязательно, '{}' — по желанию</em>
      </p>
    </motion.div>
  </div>
)

const BannedContent = () => {
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const hasSeenWarning = localStorage.getItem('bannedContentWarning')
    if (hasSeenWarning) {
      setConfirmed(true)
    }
  }, [])

  const handleConfirm = () => {
    setConfirmed(true)
    localStorage.setItem('bannedContentWarning', 'true')
  }

  if (!confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 glass-button rounded-2xl max-w-md"
        >
          <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-4">⚠️ Внимание!</h3>
          <p className="text-sm mb-6">
            Раздел содержит нецензурную лексику и запрещённые слова.
            <br /><br />
            Просмотр разрешён только пользователям старше 16 лет.
          </p>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:scale-105 transition-transform font-medium"
          >
            Мне больше 16 лет, показать
          </button>
        </motion.div>
      </motion.div>
    )
  }

  const bannedWords = [
    "xyesos, ссанина, подхалим, червь, гнилушка, хуекрут, залупоглазый, пидрила, ебарь, шкура, вонючка, падаль, крысеныш, душнила, мухосранец",
    "заднеприводный, скупердяй, бомжара, пахан, задрот, сопляк, дрищ, вафлер, вафел, гомик, чухонец, скотина, блевотина, куколд",
    "дерьмецо, мусор, отброс, подонок, чепух, мудак, кретин, тупица, шизик, нарик, алкаш, проститутка, клоун, таракан, клоп, крыса, свиноматка",
    "козёл, овца, баран, мразота, путин, пидорас, пидор, гей, негр, нигер, фемка, инцел, хуесос, еблан, долбоеб, уебан, гондон, шлюха, блядь",
    "мразь, тварь, сука, чмо, чурка, гнида, жирдяй, ссыкло, урод, дегенерат, даун, дебил, обмудок, петух, мамкин-программист, лох, сосунок",
    "залупа, ебырь, шалава, дерьмо, говноед, мамбет, свинья, хуйло, чухан, обоссанец, параша, гавно, вшивый, плебей, грязнуля, шизоид"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 p-4 glass-button rounded-xl">
        <Shield className="w-6 h-6 text-red-500" />
        <h3 className="text-lg font-semibold">Запрещённые слова:</h3>
      </div>
      
      <div className="space-y-4">
        {bannedWords.map((chunk, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="p-4 glass-button rounded-xl"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {chunk}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
const CreditsContent = () => {
  const developers = [
    {
      name: 'mkultra69',
      username: 'serialhomicide',
      website: 'mk69.su',
      github: 'https://github.com/MKultra6969',
      telegramChannel: 'https://t.me/MKextera'
    },
    {
      name: 'qidok',
      username: 'qidok',
      website: 'qdok.ru',
      github: 'https://github.com/Interium-IB',
      telegramChannel: 'https://t.me/bioexteraios'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex items-center gap-3 p-4 glass-button rounded-xl"
      >
        <Users className="w-6 h-6 text-purple-500" />
        <h3 className="text-lg font-semibold">Разработчики</h3>
      </motion.div>

      {/* Developer Cards */}
      <div className="grid gap-6">
        {developers.map((dev, index) => (
          <motion.div
            key={dev.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + index * 0.2, duration: 0.5 }}
            className="p-6 glass-button rounded-xl space-y-4"
          >
            {/* Profile Header */}
            <div className="flex items-center gap-3">
              <AvatarImage
                src={dev.username}
                alt={dev.name}
                className="shadow-lg"
                size={48}
              />
              <h4 className="text-xl font-semibold">{dev.name}</h4>
            </div>

            {/* Links */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Website */}
              <a
                href={`https://${dev.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 glass-button rounded-lg hover:scale-105 transition-transform group"
              >
                <Globe className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium">Сайт</p>
                  <p className="text-xs text-gray-500">{dev.website}</p>
                </div>
              </a>

              {/* GitHub */}
              <a
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 glass-button rounded-lg hover:scale-105 transition-transform group"
              >
                <Github className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium">GitHub</p>
                  <p className="text-xs text-gray-500">{dev.github.split('/').pop()}</p>
                </div>
              </a>

              {/* Telegram DM */}
              <a
                href={`https://t.me/${dev.username.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 glass-button rounded-lg hover:scale-105 transition-transform group"
              >
                <MessageCircle className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium">Telegram</p>
                  <p className="text-xs text-gray-500">@{dev.username}</p>
                </div>
              </a>

              {/* Telegram Channel */}
              <a
                href={dev.telegramChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 glass-button rounded-lg hover:scale-105 transition-transform group"
              >
                <MessageCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium">Канал</p>
                  <p className="text-xs text-gray-500">{dev.telegramChannel.split('/').pop()}</p>
                </div>
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="p-6 glass-button rounded-xl text-center"
      >
        <h4 className="text-lg font-semibold mb-2">💜 Спасибо за exteraFans!</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Создано с любовью к комьюнити
        </p>
      </motion.div>
    </motion.div>
  );
};


function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [activeTab, setActiveTab] = useState<'info' | 'banned' | 'credits'>('info')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (prefersDark) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-black dark:via-gray-900 dark:to-black transition-all duration-500">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-50 p-3 glass-button rounded-full liquid-shadow dark:liquid-shadow-dark sm:top-6 sm:bottom-auto"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6 text-slate-600" />
            ) : (
              <Sun className="w-6 h-6 text-yellow-300" />
            )}
          </motion.button>

          {/* Main Card */}
          <div className="glass-card liquid-shadow dark:liquid-shadow-dark rounded-2xl overflow-hidden backdrop-blur-xl">
            {/* Tabs */}
            <div className="flex">
              <Tab
                id="info"
                label="Info"
                icon={<Info className="w-4 h-4" />}
                isActive={activeTab === 'info'}
                onClick={() => setActiveTab('info')}
              />
              <Tab
                id="banned"
                label="Запрещённые слова"
                icon={<Shield className="w-4 h-4" />}
                isActive={activeTab === 'banned'}
                onClick={() => setActiveTab('banned')}
              />
              <Tab
                id="credits"
                label="Credits"
                icon={<Users className="w-4 h-4" />}
                isActive={activeTab === 'credits'}
                onClick={() => setActiveTab('credits')}
              />
            </div>

            {/* Content */}
            <Content isActive={activeTab === 'info'}>
              <InfoContent />
            </Content>
            <Content isActive={activeTab === 'banned'}>
              <BannedContent />
            </Content>
            <Content isActive={activeTab === 'credits'}>
              <CreditsContent />
            </Content>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="space-y-2">
              <p>© 2025 exteraFans Info</p>
              <div className="text-xs space-y-1">
                <p><strong>qidok:</strong> - Core idea + old website</p>
                <p><strong>mkultra69</strong> - code; bot; website; rock&roll</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default App