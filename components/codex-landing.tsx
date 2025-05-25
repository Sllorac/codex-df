"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Box, Flex, Heading, Text, Input, Button, useColorModeValue } from "@chakra-ui/react"
import { TypeAnimation } from "react-type-animation"

const CodexLanding = () => {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const audioBuffers = useRef<{ [key: string]: AudioBuffer }>({})
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""

  useEffect(() => {
    setupAudioSystem()
  }, [])

  const setupAudioSystem = async () => {
    const context = new AudioContext()
    setAudioContext(context)

    const audioUrls = {
      typing: [`${baseUrl}/sounds/public/sounds/typewriter-typing-68696.mp3`],
      error: [`${baseUrl}/sounds/public/sounds/error_sound-221445.mp3`],
      wistful: [`${baseUrl}/sounds/public/sounds/wistful-1-39105.mp3`],
    }

    console.log("🎵 URLs dos áudios atualizadas:", audioUrls)
    console.log("🌐 Base URL:", baseUrl)

    try {
      await loadAudioBuffers(audioUrls, context)
    } catch (error) {
      console.error("Error loading audio:", error)
    }
  }

  const loadAudioBuffers = async (audioUrls: { [key: string]: string[] }, context: AudioContext) => {
    for (const key in audioUrls) {
      const url = audioUrls[key][0]
      try {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await context.decodeAudioData(arrayBuffer)
        audioBuffers.current[key] = audioBuffer
      } catch (error) {
        console.error(`Error loading ${key} audio:`, error)
      }
    }
  }

  const playSound = (soundName: string) => {
    if (!audioContext || !audioBuffers.current[soundName]) return

    const source = audioContext.createBufferSource()
    source.buffer = audioBuffers.current[soundName]
    source.connect(audioContext.destination)
    source.start()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setOutput("")
    playSound("typing")

    try {
      const response = await fetch("/api/codex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      })

      if (!response.ok) {
        playSound("error")
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.text) {
        setOutput(data.text)
        playSound("wistful")
      } else {
        setOutput("No response received.")
        playSound("error")
      }
    } catch (error: any) {
      console.error("Error:", error)
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const bgColor = useColorModeValue("gray.50", "gray.700")
  const textColor = useColorModeValue("gray.700", "gray.50")
  const buttonColor = useColorModeValue("blue.500", "blue.300")

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" bg={bgColor} color={textColor} p={4}>
      <Heading mb={4} fontSize="4xl">
        Codex Interface
      </Heading>
      <Text mb={4} fontSize="lg">
        Enter your prompt below:
      </Text>
      <Input
        placeholder="Enter your prompt here"
        size="lg"
        mb={2}
        value={input}
        onChange={handleInputChange}
        bg="white"
        color="black"
      />
      <Button
        colorScheme="blue"
        size="lg"
        onClick={handleSubmit}
        isLoading={isLoading}
        mb={4}
        bg={buttonColor}
        color="white"
        _hover={{ bg: useColorModeValue("blue.700", "blue.500") }}
      >
        Submit
      </Button>
      {output && (
        <Box p={4} borderWidth="1px" borderRadius="md" bg="white" color="black" maxWidth="80%" textAlign="left">
          <Heading size="md" mb={2}>
            Output:
          </Heading>
          <TypeAnimation sequence={[output]} speed={80} repeat={false} cursor={false} />
        </Box>
      )}
    </Flex>
  )
}

export default CodexLanding
