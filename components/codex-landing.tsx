// components/codex-landing.tsx

// 🎵 URLs DOS ÁUDIOS - APENAS LOCAIS
const getAudioUrls = () => {
  const timestamp = Date.now() // Cache busting
  return {
    typing: [`/sounds/typewriter-typing-68696.mp3?v=${timestamp}`, "/sounds/typewriter-typing-68696.mp3"],
    error: [`/sounds/error_sound-221445.mp3?v=${timestamp}`, "/sounds/error_sound-221445.mp3"],
    wistful: [`/sounds/wistful-1-39105.mp3?v=${timestamp}`, "/sounds/wistful-1-39105.mp3"],
  }
}

// 🎵 FUNÇÃO PARA TENTAR CARREGAR ÁUDIO LOCAL
const tryLoadAudio = async (urls: string[], type: string): Promise<HTMLAudioElement | null> => {
  for (let i = 0; i < urls.length; i++) {
    try {
      addDebugLog(`🔄 Tentando carregar ${type} da fonte ${i + 1}/${urls.length}: ${urls[i]}`)

      const audio = new Audio()
      audio.crossOrigin = "anonymous"
      audio.preload = "auto"
      audio.volume = type === "typing" ? 0.3 : 0.4

      if (type === "typing" || type === "error") {
        audio.loop = true
      }

      const loadPromise = new Promise<HTMLAudioElement>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Timeout ao carregar ${type} da fonte ${i + 1}`))
        }, 8000)

        const onCanPlay = () => {
          clearTimeout(timeout)
          addDebugLog(`✅ ${type} carregado da fonte ${i + 1}! Duração: ${audio.duration}s`)
          audio.removeEventListener("canplaythrough", onCanPlay)
          audio.removeEventListener("loadeddata", onCanPlay)
          audio.removeEventListener("error", onError)
          resolve(audio)
        }

        const onError = (e: any) => {
          clearTimeout(timeout)
          addDebugLog(`❌ ${type} ERRO na fonte ${i + 1}: ${e.type || e.message}`)
          audio.removeEventListener("canplaythrough", onCanPlay)
          audio.removeEventListener("loadeddata", onCanPlay)
          audio.removeEventListener("error", onError)
          reject(new Error(`Erro ao carregar ${type}: ${e.type}`))
        }

        audio.addEventListener("canplaythrough", onCanPlay)
        audio.addEventListener("loadeddata", onCanPlay)
        audio.addEventListener("error", onError)

        audio.src = urls[i]
        audio.load()
      })

      const loadedAudio = await loadPromise
      return loadedAudio
    } catch (error) {
      addDebugLog(`⚠️ ${type} Fonte ${i + 1} falhou: ${error}`)
      if (i === urls.length - 1) {
        addDebugLog(`🔄 ${type} Todas as fontes falharam - modo sintético ativado`)
        return null
      }
    }
  }
  return null
}
