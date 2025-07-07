import ChatApp from "./components/ChatApp"

const App = () => {
  return (
    <div className="min-h-screen w-screen relative flex items-center justify-center">
      <h2 className="text-4xl font-bold text-center">
        Welcome to<br /><span className="bg-gradient-to-t from-amber-400 to-red-400 bg-clip-text text-transparent">ChatBox System</span>
      </h2>
      <ChatApp />
    </div>
  )
}
export default App