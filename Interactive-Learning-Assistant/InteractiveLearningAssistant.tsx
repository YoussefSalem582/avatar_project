import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextToSpeech } from './TextToSpeech'
import { AvatarCustomizer } from './AvatarCustomizer'

export default function InteractiveLearningAssistant() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [avatar, setAvatar] = useState<THREE.Object3D | null>(null)
  const [emotion, setEmotion] = useState<string>('neutral')

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(0, 10, 5)
    scene.add(directionalLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    const loader = new GLTFLoader()
    loader.load('/assets/3d/duck.glb', (gltf) => {
      const avatarModel = gltf.scene
      avatarModel.position.set(0, 0, 0)
      avatarModel.scale.set(0.01, 0.01, 0.01)
      scene.add(avatarModel)
      setAvatar(avatarModel)
    }, undefined, (error) => {
      console.error('An error occurred loading the 3D model:', error)
    })

    camera.position.z = 5

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  const handleEmotionChange = (newEmotion: string) => {
    setEmotion(newEmotion)
    // Here you would update the avatar's expression based on the new emotion
    console.log(`Emotion changed to: ${newEmotion}`)
  }

  return (
    <div className="w-full h-screen">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 left-4">
        <TextToSpeech />
      </div>
      <div className="absolute top-4 right-4">
        <AvatarCustomizer avatar={avatar} />
      </div>
      <div className="absolute bottom-4 left-4">
        <button onClick={() => handleEmotionChange('happy')} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Happy</button>
        <button onClick={() => handleEmotionChange('sad')} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Sad</button>
        <button onClick={() => handleEmotionChange('neutral')} className="bg-gray-500 text-white px-4 py-2 rounded">Neutral</button>
      </div>
    </div>
  )
}

