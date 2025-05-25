"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Space_Mono } from "next/font/google"

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export default function CodexLanding() {
  const [currentPage, setCurrentPage] = useState<"initial" | "funnel">("initial")
  const [typedText, setTypedText] = useState("")
  const [showCTA, setShowCTA] = useState(false)
  const [copyIndex, setCopyIndex] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showGlitch, setShowGlitch] = useState(false)
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [logoGlitch, setLogoGlitch] = useState(false)
  const [initialLogoGlitch, setInitialLogoGlitch] = useState(false)
  const [ctaGlitch, setCtaGlitch] = useState(false)
  const [watermarkGlitch, setWatermarkGlitch] = useState(false)
  const [backgroundGlitch, setBackgroundGlitch] = useState(false)

  // ESTADOS PARA O CTA FINAL
  const [showFinalCTA, setShowFinalCTA] = useState(false)
  const [finalCtaGlitch, setFinalCtaGlitch] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)

  // NOVA LÓGICA DE ERRO - MAIS SIMPLES
  const [systemError, setSystemError] = useState(false)
  const [errorFixed, setErrorFixed] = useState(false)
  const [textBeforeError, setTextBeforeError] = useState("")
  const [textAfterError, setTextAfterError] = useState("")

  const [feedbackIndex, setFeedbackIndex] = useState(0)

  // ESTADO PARA CONTROLAR PAUSA ENTRE FRASES
  const [isPaused, setIsPaused] = useState(false)

  // ESTADO PARA CONTROLAR SOM DE DIGITAÇÃO
  const [isTypingSound, setIsTypingSound] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)

  // Adicionar novos estados após os estados existentes
  const [isErrorSound, setIsErrorSound] = useState(false)
  const [isWistfulSound, setIsWistfulSound] = useState(false)

  // REFs para os áudios ORIGINAIS
  const typingAudioRef = useRef<HTMLAudioElement | null>(null)
  const errorAudioRef = useRef<HTMLAudioElement | null>(null)
  const wistfulAudioRef = useRef<HTMLAudioElement | null>(null)

  const copy = `Quantas vezes você já perdeu horas tentando criar um criativo que realmente vende?

Abre o Canva, tenta modelar algo, mas nada fica bom. E mesmo quando termina, bate a dúvida: "Será que isso vai converter?"

Agora, por apenas ??,?? reais, você pode acabar com esse ciclo.

Um agente de inteligência artificial cria pra você criativos completos, no estilo que quiser: cinemático, publicitário, Pixar, cartoon, o que estiver no hype.

Você só diz o que quer, pode subir sua imagem, e em 3 minutos recebe dois criativos:
um com texto, outro com o fundo separado pra testar variações.

Viu só? É isso que eu faço: apenas um comando simples e ela faz criativos. O resultado? Anúncios que não só chamam atenção, mas convertem de verdade.

"Mas isso vende mesmo?"

Subi uma campanha com esses criativos. Resultado?
116 vendas de um e-book com CPA de R$6,59.

SOCIAL_PROOF_CAROUSEL

Você pode continuar travado, perdendo tempo, ou ativar agora o Agente de Criativos com I.A.

E o melhor: esse plano é só uma degustação — sua porta de entrada pro mundo real dos criativos que convertem e da I.A. que transforma.

Você recebe:
• O Agente Gerador de Criativos
• Uma vídeo-aula ensinando como usar
• Acesso vitalício
• E tudo isso… por apenas R$17

De R$197 por R$17.

Sem mensalidade. Sem enrolação. Sem desculpa.`

  const typingSpeed = 30
  const pauseBetweenSentences = 1000 // 1 segundo de pausa entre frases
  const errorTriggerText = "um com texto, outro com o fundo separado pra testar variações."

  // DADOS DOS FEEDBACKS - VERSÃO SIMPLIFICADA
  const testimonials = [
    {
      id: 1,
      text: "8 VENDAS EM 24H - nem mexi em nada! 🚀",
    },
    {
      id: 2,
      text: "5 VARIAÇÕES EM 10 MIN - conversão subiu 300% 📈",
    },
    {
      id: 3,
      text: "12 VENDAS NO PRIMEIRO DIA - mudou tudo! 💰",
    },
    {
      id: 4,
      text: "CPA CAIU DE R$45 PARA R$6 - inacreditável! ⚡",
    },
  ]

  // FUNÇÃO PARA CARREGAR ÁUDIO ORIGINAL
  const tryLoadAudio = async (urls: string[], type: string): Promise<HTMLAudioElement | null> => {
    for (let i = 0; i < urls.length; i++) {
      try {
        console.log(`🔄 Tentando carregar ${type} da fonte ${i + 1}/${urls.length}: ${urls[i]}`)

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
            console.log(`✅ ${type} carregado da fonte ${i + 1}! Duração: ${audio.duration}s`)
            audio.removeEventListener("canplaythrough", onCanPlay)
            audio.removeEventListener("loadeddata", onCanPlay)
            audio.removeEventListener("error", onError)
            resolve(audio)
          }

          const onError = (e: any) => {
            clearTimeout(timeout)
            console.log(`❌ ${type} ERRO na fonte ${i + 1}: ${e.type || e.message}`)
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
        console.log(`⚠️ ${type} Fonte ${i + 1} falhou: ${error}`)
        if (i === urls.length - 1) {
          console.log(`🔄 ${type} Todas as fontes falharam`)
          return null
        }
      }
    }
    return null
  }

  // INICIALIZAR SISTEMA DE ÁUDIO ORIGINAL
  const setupAudioSystem = async () => {
    console.log("🎵 Inicializando sistema de áudio ORIGINAL...")

    try {
      // URLs CORRETAS para os áudios
      const audioUrls = {
        typing: ["/sounds/public/sounds/typewriter-typing-68696.mp3"],
        error: ["/sounds/public/sounds/error_sound-221445.mp3"],
        wistful: ["/sounds/public/sounds/wistful-1-39105.mp3"],
      }

      console.log("🎵 URLs dos áudios:", audioUrls)

      const [typingAudio, errorAudio, wistfulAudio] = await Promise.allSettled([
        tryLoadAudio(audioUrls.typing, "typing"),
        tryLoadAudio(audioUrls.error, "error"),
        tryLoadAudio(audioUrls.wistful, "wistful"),
      ])

      let loadedCount = 0

      if (typingAudio.status === "fulfilled" && typingAudio.value) {
        typingAudioRef.current = typingAudio.value
        loadedCount++
        console.log("✅ Áudio de digitação carregado!")
      }

      if (errorAudio.status === "fulfilled" && errorAudio.value) {
        errorAudioRef.current = errorAudio.value
        loadedCount++
        console.log("✅ Áudio de erro carregado!")
      }

      if (wistfulAudio.status === "fulfilled" && wistfulAudio.value) {
        wistfulAudioRef.current = wistfulAudio.value
        loadedCount++
        console.log("✅ Áudio wistful carregado!")

        wistfulAudio.value.addEventListener("ended", () => {
          console.log("🎵 Áudio wistful terminou")
          setIsWistfulSound(false)
        })
      }

      console.log(`🎵 Sistema ORIGINAL: ${loadedCount}/3 áudios carregados`)
      setAudioReady(true)
    } catch (error) {
      console.log(`⚠️ Erro no sistema de áudio: ${error}`)
      setAudioReady(true)
    }
  }

  // DETECTAR PRIMEIRA INTERAÇÃO
  useEffect(() => {
    const handleFirstInteraction = (event: Event) => {
      if (!userInteracted) {
        setUserInteracted(true)
        console.log(`👆 Primeira interação detectada! (${event.type})`)
        setupAudioSystem()

        // Tentar reproduzir um som de teste
        setTimeout(() => {
          if (typingAudioRef.current) {
            typingAudioRef.current
              .play()
              .then(() => {
                typingAudioRef.current?.pause()
                console.log("🎵 Teste de áudio bem-sucedido!")
              })
              .catch((e) => console.log("⚠️ Teste de áudio falhou:", e))
          }
        }, 1000)
      }
    }

    if (!userInteracted) {
      const events = ["click", "touchstart", "keydown", "mousedown"]
      events.forEach((event) => {
        document.addEventListener(event, handleFirstInteraction, { once: false, passive: true })
      })

      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, handleFirstInteraction)
        })
      }
    }
  }, [userInteracted])

  // FUNÇÃO PARA DETECTAR FIM DE FRASE
  const isEndOfSentence = (text: string, index: number) => {
    const char = text[index - 1]
    const nextChar = text[index]

    if (
      (char === "." || char === "!" || char === "?") &&
      (nextChar === " " || nextChar === "\n" || index === text.length)
    ) {
      return true
    }

    if (char === "\n" && nextChar === "\n") {
      return true
    }

    return false
  }

  // FUNÇÃO PARA DETECTAR INÍCIO DE FRASE
  const isStartOfSentence = (text: string, index: number) => {
    if (index === 0) return true

    const prevChar = text[index - 1]
    const currentChar = text[index]

    if ((prevChar === "." || prevChar === "!" || prevChar === "?") && currentChar !== " " && currentChar !== "\n") {
      return true
    }

    if (index >= 2 && text[index - 2] === "\n" && text[index - 1] === "\n") {
      return true
    }

    if (prevChar === '"' && currentChar !== " ") {
      return true
    }

    return false
  }

  // FUNÇÕES DE SOM ORIGINAIS - MELHORADAS
  const startTypingSound = () => {
    if (!soundEnabled || !userInteracted || !typingAudioRef.current) {
      console.log("🔇 Som de digitação não disponível")
      return
    }

    try {
      const audio = typingAudioRef.current
      audio.pause()
      audio.currentTime = 0

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsTypingSound(true)
            console.log("🔊 Som de digitação ORIGINAL iniciado!")
          })
          .catch((error) => {
            console.log(`⚠️ Erro no áudio original: ${error}`)
          })
      }
    } catch (error) {
      console.log(`⚠️ Erro na função original: ${error}`)
    }
  }

  const stopTypingSound = () => {
    if (typingAudioRef.current && !typingAudioRef.current.paused) {
      try {
        typingAudioRef.current.pause()
        typingAudioRef.current.currentTime = 0
        console.log("🔇 Som de digitação PARADO")
      } catch (error) {
        console.log(`⚠️ Erro ao parar som: ${error}`)
      }
    }
    setIsTypingSound(false)
  }

  const startErrorSound = () => {
    if (!soundEnabled || !userInteracted || !errorAudioRef.current) {
      console.log("🔇 Som de erro não disponível")
      return
    }

    try {
      const audio = errorAudioRef.current
      audio.pause()
      audio.currentTime = 0

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsErrorSound(true)
            console.log("🔊 Som de erro ORIGINAL iniciado!")
          })
          .catch((error) => {
            console.log(`⚠️ Erro no áudio de erro: ${error}`)
          })
      }
    } catch (error) {
      console.log(`⚠️ Erro na função de erro: ${error}`)
    }
  }

  const stopErrorSound = () => {
    if (errorAudioRef.current && !errorAudioRef.current.paused) {
      try {
        errorAudioRef.current.pause()
        errorAudioRef.current.currentTime = 0
        console.log("🔇 Som de erro PARADO")
      } catch (error) {
        console.log(`⚠️ Erro ao parar som de erro: ${error}`)
      }
    }
    setIsErrorSound(false)
  }

  const startWistfulSound = () => {
    if (!soundEnabled || !userInteracted || !wistfulAudioRef.current) {
      console.log("🔇 Som wistful não disponível")
      return
    }

    try {
      const audio = wistfulAudioRef.current
      audio.pause()
      audio.currentTime = 0

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsWistfulSound(true)
            console.log("🔊 Som wistful ORIGINAL iniciado!")
          })
          .catch((error) => {
            console.log(`⚠️ Erro no áudio wistful: ${error}`)
          })
      }
    } catch (error) {
      console.log(`⚠️ Erro na função wistful: ${error}`)
    }
  }

  const stopWistfulSound = () => {
    if (wistfulAudioRef.current && !wistfulAudioRef.current.paused) {
      try {
        wistfulAudioRef.current.pause()
        wistfulAudioRef.current.currentTime = 0
        console.log("🔇 Som wistful PARADO")
      } catch (error) {
        console.log(`⚠️ Erro ao parar som wistful: ${error}`)
      }
    }
    setIsWistfulSound(false)
  }

  // CARROSSEL DE FEEDBACKS
  const TimelineFeedbacks = ({
    currentIndex,
    setCurrentIndex,
  }: { currentIndex: number; setCurrentIndex: (index: number) => void }) => {
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsReady(true)
        console.log("🎯 Carrossel pronto para interação!")
      }, 100)

      return () => clearTimeout(timer)
    }, [])

    const handleDotClick = (index: number) => {
      if (!isReady) return
      setCurrentIndex(index)
      console.log(`👆 Clique no dot: ${index}`)
    }

    const handleFeedbackClick = (index: number) => {
      if (!isReady) return
      setCurrentIndex(index)
      console.log(`📝 Clique na frase: ${index}`)
    }

    const currentTestimonial = testimonials[currentIndex]

    return (
      <div className="simple-timeline-feedbacks">
        <div className="testimonials-title">📊 FEEDBACKS ✅</div>

        <div className="simple-feedback-item show">
          <div className="simple-feedback-box">
            <div className="simple-feedback-header">
              <span className="simple-feedback-icon">💬</span>
              <span className="simple-feedback-title">Resultado #{currentTestimonial.id}</span>
              <span className="simple-feedback-time">há {currentIndex + 1}h</span>
            </div>

            <div className="simple-feedback-content">"{currentTestimonial.text}"</div>

            <div className="simple-feedback-footer">
              <span className="simple-feedback-verified">✅ Verificado</span>
            </div>
          </div>
        </div>

        <div className="dots">
          {testimonials.map((_, index) => (
            <div
              key={`dot-${index}`}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>

        <div className="testimonial-list">
          <div className="testimonial-list-title">Últimos resultados (clique para ver):</div>
          {testimonials.map((testimonial, index) => (
            <div
              key={`list-${testimonial.id}`}
              className={`testimonial-list-item ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleFeedbackClick(index)}
            >
              • {testimonial.text}
            </div>
          ))}
        </div>

        <div style={{ color: "#666", fontSize: "9px", textAlign: "center", marginTop: "12px", fontStyle: "italic" }}>
          💡 Clique nos resultados acima ou nos pontos para navegar
        </div>
      </div>
    )
  }

  // Função para corromper texto apenas quando necessário
  const getDisplayText = (text: string) => {
    if (!systemError || errorFixed) {
      return text // Texto normal
    }

    // Corrompe o texto apenas quando há erro e não foi corrigido
    const chars = ["█", "▓", "▒", "░", "!", "@", "#", "$", "%", "^", "&", "*", "?", "<", ">", "|", "~"]
    return text
      .split("")
      .map((char) => {
        if (char === " " || char === "\n") return char
        const random = Math.random()
        if (random < 0.3) return chars[Math.floor(Math.random() * chars.length)]
        if (random < 0.4) return ""
        if (random < 0.5) return char + char
        return char
      })
      .join("")
  }

  // Show continue button after 1 second
  useEffect(() => {
    if (currentPage === "initial") {
      const timer = setTimeout(() => {
        setShowContinueButton(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentPage])

  // Glitch effects
  useEffect(() => {
    if (currentPage === "initial") {
      const initialDelay = setTimeout(() => {
        const glitchInterval = setInterval(() => {
          setShowGlitch(true)
          setTimeout(() => setShowGlitch(false), 200)
        }, 1000)
        setShowGlitch(true)
        setTimeout(() => setShowGlitch(false), 200)
        return () => clearInterval(glitchInterval)
      }, 2000)
      return () => clearTimeout(initialDelay)
    }
  }, [currentPage])

  useEffect(() => {
    if (currentPage === "initial") {
      const interval = setInterval(() => {
        setInitialLogoGlitch(true)
        setTimeout(() => setInitialLogoGlitch(false), 200)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [currentPage])

  useEffect(() => {
    if (currentPage === "funnel") {
      const interval = setInterval(() => {
        setLogoGlitch(true)
        setTimeout(() => setLogoGlitch(false), 150)
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [currentPage])

  useEffect(() => {
    if (showCTA && currentPage === "funnel") {
      const interval = setInterval(() => {
        setCtaGlitch(true)
        setTimeout(() => setCtaGlitch(false), 180)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [showCTA, currentPage])

  useEffect(() => {
    if (currentPage === "funnel") {
      const interval = setInterval(() => {
        setWatermarkGlitch(true)
        setTimeout(() => setWatermarkGlitch(false), 300)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [currentPage])

  // EFEITO DE FALHA NO FUNDO A CADA 5 SEGUNDOS
  useEffect(() => {
    if (currentPage === "funnel") {
      const interval = setInterval(() => {
        setBackgroundGlitch(true)
        setTimeout(() => setBackgroundGlitch(false), 300)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [currentPage])

  // EFEITO PARA MOSTRAR O CTA FINAL QUANDO A DIGITAÇÃO TERMINAR
  useEffect(() => {
    if (typingComplete && !showFinalCTA) {
      console.log("Digitação completa, mostrando CTA final...")
      const timer = setTimeout(() => {
        setShowFinalCTA(true)
        console.log("CTA final ativado!")

        setTimeout(() => {
          setFinalCtaGlitch(true)
          setTimeout(() => setFinalCtaGlitch(false), 300)

          const glitchInterval = setInterval(() => {
            setFinalCtaGlitch(true)
            setTimeout(() => setFinalCtaGlitch(false), 300)
          }, 3000)

          return () => clearInterval(glitchInterval)
        }, 1000)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [typingComplete, showFinalCTA])

  // Controlar som de erro
  useEffect(() => {
    if (systemError && !errorFixed) {
      stopTypingSound()
      startErrorSound()
    } else if (errorFixed || !systemError) {
      stopErrorSound()
    }
  }, [systemError, errorFixed, soundEnabled, userInteracted])

  // Controlar som wistful
  useEffect(() => {
    if (errorFixed && !isWistfulSound) {
      console.log("🎯 INICIANDO SOM WISTFUL - errorFixed detectado")

      stopErrorSound()

      const timer = setTimeout(() => {
        console.log("🎵 Tentando iniciar som wistful...")
        startWistfulSound()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [errorFixed, soundEnabled, userInteracted])

  // NOVA LÓGICA DE DIGITAÇÃO COM PAUSA ENTRE FRASES E SOM
  useEffect(() => {
    if (currentPage === "funnel" && copyIndex <= copy.length && !isPaused) {
      // Se chegou no texto de erro e ainda não foi ativado
      if (typedText.includes(errorTriggerText) && !systemError && !errorFixed) {
        stopTypingSound()

        const triggerIndex = typedText.indexOf(errorTriggerText)
        const beforeError = typedText.substring(0, triggerIndex + errorTriggerText.length)
        const afterError = copy.substring(triggerIndex + errorTriggerText.length)

        setTextBeforeError(beforeError)
        setTextAfterError(afterError)

        setTimeout(() => {
          setSystemError(true)
        }, 1000)
        return
      }

      // Se o erro foi corrigido, continua digitando o texto após o erro
      if (errorFixed && textAfterError) {
        const remainingText = textAfterError
        const currentAfterIndex = copyIndex - textBeforeError.length

        if (currentAfterIndex < remainingText.length) {
          if (isStartOfSentence(textAfterError, currentAfterIndex) && !isTypingSound && !isWistfulSound) {
            startTypingSound()
          }

          if (isEndOfSentence(textAfterError, currentAfterIndex)) {
            console.log("⏸️ Pausa após frase detectada")
            stopTypingSound()
            setIsPaused(true)
            setTimeout(() => {
              setIsPaused(false)
              setCopyIndex(copyIndex + 1)
            }, pauseBetweenSentences)
            return
          }

          const timer = setTimeout(() => {
            setCopyIndex(copyIndex + 1)

            if (copyIndex % 50 === 0) {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
          }, typingSpeed)
          return () => clearTimeout(timer)
        } else {
          stopTypingSound()
          console.log("Digitação após erro completa")
          setTypingComplete(true)
        }
        return
      }

      // Verificar se chegou no placeholder dos testimonials
      const currentText = copy.substring(0, copyIndex)
      if (currentText.includes("SOCIAL_PROOF_CAROUSEL")) {
        const beforeTestimonials = currentText.replace("SOCIAL_PROOF_CAROUSEL", "")
        setTypedText(beforeTestimonials)

        setTimeout(() => {
          setCopyIndex(copy.indexOf("SOCIAL_PROOF_CAROUSEL") + "SOCIAL_PROOF_CAROUSEL".length)
        }, 2000)
        return
      }

      // Se ainda não chegou no erro, continua digitando normalmente
      if (!typedText.includes(errorTriggerText)) {
        if (isStartOfSentence(copy, copyIndex) && !isTypingSound) {
          startTypingSound()
        }

        if (isEndOfSentence(copy, copyIndex)) {
          console.log("⏸️ Pausa após frase detectada")
          stopTypingSound()
          setIsPaused(true)
          setTimeout(() => {
            setIsPaused(false)
            setTypedText(copy.substring(0, copyIndex))
            setCopyIndex(copyIndex + 1)
          }, pauseBetweenSentences)
          return
        }

        const timer = setTimeout(() => {
          setTypedText(copy.substring(0, copyIndex))
          setCopyIndex(copyIndex + 1)

          if (copyIndex % 50 === 0) {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            })
          }
        }, typingSpeed)
        return () => clearTimeout(timer)
      }
    } else if (copyIndex > copy.length && !systemError) {
      stopTypingSound()
      setTypedText(copy)
      console.log("Digitação normal completa")
      setTypingComplete(true)
      setTimeout(() => setShowCTA(true), 300)
    }
  }, [
    currentPage,
    copyIndex,
    copy,
    typedText,
    systemError,
    errorFixed,
    errorTriggerText,
    textBeforeError,
    textAfterError,
    isPaused,
    isTypingSound,
    isWistfulSound,
  ])

  // FORÇA O SCROLL PARA O TOPO AO CARREGAR A PÁGINA
  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 100)

    return () => clearTimeout(timer)
  }, [currentPage])

  const handleEnter = () => {
    stopTypingSound()

    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    setCurrentPage("funnel")
    setCopyIndex(0)
    setTypedText("")
    setShowCTA(false)
    setShowFinalCTA(false)
    setTypingComplete(false)
    setSystemError(false)
    setErrorFixed(false)
    setTextBeforeError("")
    setTextAfterError("")
    setIsPaused(false)

    setTimeout(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 50)
  }

  const scrollToSignup = () => {
    console.log("CTA clicked")
    window.open("https://checkout.perfectpay.com.br/P/646077", "_blank")
  }

  const handleFinalCTA = () => {
    console.log("🎯 FINAL CTA CLICKED! Redirecionando para checkout...")
    window.open("https://checkout.perfectpay.com.br/P/646077", "_blank")
  }

  const handleFixError = () => {
    console.log("🔧 Fixing system error...")

    stopErrorSound()

    setTimeout(() => {
      setErrorFixed(true)
      console.log("✅ Error fixed - wistful deveria tocar agora")

      setTimeout(() => {
        console.log("🎯 Continuando digitação após wistful")
        setCopyIndex(textBeforeError.length)
      }, 1500)
    }, 200)
  }

  // FUNÇÃO PARA RENDERIZAR TEXTO COM CARROSSEL E PREÇOS COLORIDOS
  const renderTextWithSocialProof = (text: string) => {
    const carouselMarker = "SOCIAL_PROOF_CAROUSEL"
    const carouselIndex = text.indexOf(carouselMarker)

    if (carouselIndex !== -1) {
      const beforeCarousel = text.substring(0, carouselIndex)
      const afterCarousel = text.substring(carouselIndex + carouselMarker.length)

      return (
        <>
          {renderStyledText(beforeCarousel)}
          <TimelineFeedbacks currentIndex={feedbackIndex} setCurrentIndex={setFeedbackIndex} />
          {renderStyledText(afterCarousel)}
        </>
      )
    }

    return renderStyledText(text)
  }

  // Função auxiliar para aplicar estilos de preço
  const renderStyledText = (text: string) => {
    let styledText = text

    const mysteryPricePattern = /(\?\?,\?\?)/g
    styledText = styledText.replace(mysteryPricePattern, (match) => {
      return `<span class="price-highlight">${match}</span>`
    })

    const pricePattern1 = /(De )(R\$197)( por )(R\$17)(\.)/g
    styledText = styledText.replace(pricePattern1, (match, de, oldPrice, por, newPrice, dot) => {
      return `${de}<span class="price-old">${oldPrice}</span>${por}<span class="price-new">${newPrice}</span>${dot}`
    })

    const pricePattern2 = /(por apenas )(R\$17)( reais)/g
    styledText = styledText.replace(pricePattern2, (match, porApenas, price, reais) => {
      return `${porApenas}<span class="price-new">${price}</span>${reais}`
    })

    if (styledText !== text) {
      return <span className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: styledText }} />
    }

    return <span className="whitespace-pre-wrap">{text}</span>
  }

  // COMPONENTE DE CHUVA CYBERPUNK
  const RainEffect = () => {
    return (
      <div className="rain-container">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={`raindrop-${i}`} className="raindrop" />
        ))}
      </div>
    )
  }

  // LOGO WATERMARK CYBERPUNK
  const WatermarkLogo = () => {
    return (
      <div className={`watermark-logo-codex ${watermarkGlitch ? "watermark-glitch" : ""}`}>
        <Image
          src="/images/codex-logo-cyberpunk.png"
          alt="CODEX Watermark"
          width={400}
          height={400}
          className="w-full h-full object-contain"
          priority={false}
        />
      </div>
    )
  }

  if (currentPage === "initial") {
    return (
      <div className={`min-h-screen bg-black text-white overflow-hidden relative screen-border ${spaceMono.className}`}>
        <div className="absolute top-4 right-4 z-10">
          <div
            className="text-sm text-gray-500 cursor-pointer hover:text-gray-300 transition-colors select-none"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            Som : {soundEnabled ? "ON" : "OFF"}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className={`${initialLogoGlitch ? "glitch-logo-3d" : ""}`}>
              <Image
                src="/images/codex-logo-clean.png"
                alt="Logo CODEX"
                width={120}
                height={120}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter brightness-110"
                priority
              />
            </div>

            <div
              className={`text-white text-base sm:text-lg md:text-xl leading-relaxed max-w-md ${showGlitch ? "glitch-text" : ""}`}
            >
              A inteligência artificial criou a sala. Você foi o escolhido pra entrar.
            </div>

            {showContinueButton && (
              <div
                className="text-gray-500 cursor-pointer animate-pulse hover:text-gray-300 transition-colors text-sm sm:text-base mt-8"
                onClick={handleEnter}
              >
                {"> continuar _"}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen text-white screen-border relative ${spaceMono.className} ${systemError && !errorFixed ? "system-corrupted" : ""} ${backgroundGlitch ? "background-glitch-soft" : ""}`}
      style={{
        backgroundImage: `url('/images/codex-logo-cyberpunk.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-90" style={{ zIndex: 1 }} />

      <RainEffect />
      <WatermarkLogo />

      <div className="flex justify-between items-center p-4 relative z-10">
        <div className={`${logoGlitch ? "glitch-logo" : ""} ${systemError && !errorFixed ? "corrupted-logo" : ""}`}>
          <Image
            src="/images/codex-logo-clean.png"
            alt="Logo CODEX"
            width={60}
            height={60}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain filter brightness-110"
          />
        </div>

        <div
          className="text-sm text-gray-500 cursor-pointer hover:text-gray-300 transition-colors select-none"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          Som : {soundEnabled ? "ON" : "OFF"}
        </div>
      </div>

      <div className="px-4 pb-20 relative z-10">
        <div
          className={`text-white text-sm sm:text-base leading-relaxed ${systemError && !errorFixed ? "corrupted-text" : ""}`}
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9)" }}
        >
          {systemError ? (
            <span className="whitespace-pre-wrap">{getDisplayText(textBeforeError || typedText)}</span>
          ) : (
            renderTextWithSocialProof(typedText)
          )}
          {!systemError && !typingComplete && <span className="text-red-400 animate-pulse">_</span>}
        </div>

        {systemError && (
          <div
            className={`mt-6 mb-6 cursor-pointer transition-all duration-700 transform ${
              errorFixed ? "success-bar scale-105 hover:scale-110" : "error-bar hover:scale-102 animate-pulse"
            }`}
            onClick={!errorFixed ? handleFixError : undefined}
          >
            {errorFixed ? (
              <>
                <div className="success-bar-content">✅ &gt;&gt;&gt; SISTEMA REINTEGRADO COM SUCESSO ✅</div>
                <div className="success-bar-subtitle">Sistema operando normalmente</div>
              </>
            ) : (
              <>
                <div className="error-bar-content">🔒 &gt;&gt;&gt; ERRO NO SISTEMA - REINTEGRAÇÃO NECESSÁRIA 🔒</div>
                <div className="error-bar-subtitle">Clique para resolver o problema e continuar</div>
              </>
            )}
          </div>
        )}

        {errorFixed && textAfterError && (
          <div
            className="text-white text-sm sm:text-base leading-relaxed"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9)" }}
          >
            {renderTextWithSocialProof(textAfterError.substring(0, copyIndex - textBeforeError.length))}
            {copyIndex - textBeforeError.length < textAfterError.length && (
              <span className="text-red-400 animate-pulse">_</span>
            )}
          </div>
        )}

        {showFinalCTA && (
          <div className="mt-4">
            <span
              onClick={handleFinalCTA}
              className="text-white text-sm sm:text-base leading-relaxed cursor-pointer hover:text-cyan-400 transition-colors duration-300"
              style={{
                color: finalCtaGlitch ? "#00ff00" : "#ffffff",
                transform: finalCtaGlitch ? "translate(-2px, 1px)" : "translate(0)",
                textShadow: finalCtaGlitch
                  ? "2px 0 #ff0000, -2px 0 #0000ff, 0 2px #00ff00"
                  : "2px 2px 4px rgba(0,0,0,0.9)",
                filter: finalCtaGlitch ? "brightness(1.5) contrast(2) hue-rotate(90deg)" : "brightness(1)",
                display: "inline-block",
              }}
            >
              Clique aqui agora e transforme sua criação de anúncios para sempre.
            </span>
          </div>
        )}

        {showCTA && (
          <div
            className={`mt-6 text-cyan-400 cursor-pointer text-sm hover:text-cyan-300 transition-all duration-300 ${ctaGlitch ? "glitch-text-hacker" : ""}`}
            onClick={scrollToSignup}
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9)" }}
          >
            &gt; acesse_agora_o_sistema.exe
          </div>
        )}
      </div>
    </div>
  )
}

// Adicionar exportação nomeada também para compatibilidade
export { CodexLanding }
