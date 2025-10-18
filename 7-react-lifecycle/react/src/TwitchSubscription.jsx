import { useEffect, useState } from "react"

export default function TwitchSubscription() {
  const [isChatVisible, setIsChatVisible] = useState(true)
  return isChatVisible ? <TwitchChat onClick={() => setIsChatVisible(false)} /> : null
}

function TwitchChat({ onClick }) {
  useEffect(() => {
    let fn = (e) => console.log("scrolled", e)
    window.addEventListener("scroll", fn)

    // ! WARN: забыл отписаться от `scroll`-события.
    // Посмотрите, как скролл будет логгироваться в консоли после того, как вы нажмете на чат.
    // return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div onClick={onClick} className="text-white bg-black p-4 rounded-md min-h-5">
      Нажми меня, чтобы скрыть чат. Здесь я забыл отписаться от `scroll`-события.
    </div>
  )
}
