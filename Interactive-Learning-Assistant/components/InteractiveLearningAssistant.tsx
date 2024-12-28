'use client'

import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TextToSpeech } from './TextToSpeech'
import { AvatarCustomizer } from './AvatarCustomizer'
import { QuizComponent } from './QuizComponent'
import { Card, CardContent } from './ui/card'
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle } from 'lucide-react'

export default function InteractiveLearningAssistant() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [avatar, setAvatar] = useState<THREE.Group | null>(null)
  const [emotion, setEmotion] = useState<string>('neutral')
  const [score, setScore] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87CEEB) // Sky blue background

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7)
    scene.add(directionalLight)

    const pointLight1 = new THREE.PointLight(0xffffff, 1, 100)
    pointLight1.position.set(0, 10, 0)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100)
    pointLight2.position.set(10, 5, 10)
    scene.add(pointLight2)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20)
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }) // Brown color for ground
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.5
    scene.add(ground)

    // Create avatar with improved features
    const avatarGroup = new THREE.Group()

    // Body with better proportions
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.0, 4, 8)
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1E90FF,
      roughness: 0.7,
      metalness: 0.3
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.name = 'body'
    avatarGroup.add(body)

    // Head with better features
    const headGeometry = new THREE.SphereGeometry(0.4, 32, 32)
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFD700,
      roughness: 0.5,
      metalness: 0.2
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 1.1
    head.name = 'head'
    avatarGroup.add(head)

    // Eyes with more detail
    const eyeGeometry = new THREE.SphereGeometry(0.08, 32, 32)
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
    const eyeInnerGeometry = new THREE.SphereGeometry(0.04, 32, 32)
    const eyeInnerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })

    // Left eye group
    const leftEyeGroup = new THREE.Group()
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    const leftEyeInner = new THREE.Mesh(eyeInnerGeometry, eyeInnerMaterial)
    leftEyeInner.position.z = 0.04
    leftEyeGroup.add(leftEye, leftEyeInner)
    leftEyeGroup.position.set(-0.15, 1.2, 0.3)
    leftEyeGroup.name = 'leftEye'

    // Right eye group
    const rightEyeGroup = new THREE.Group()
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    const rightEyeInner = new THREE.Mesh(eyeInnerGeometry, eyeInnerMaterial)
    rightEyeInner.position.z = 0.04
    rightEyeGroup.add(rightEye, rightEyeInner)
    rightEyeGroup.position.set(0.15, 1.2, 0.3)
    rightEyeGroup.name = 'rightEye'

    avatarGroup.add(leftEyeGroup, rightEyeGroup)

    // Improved mouth with better expressions
    const mouthGeometry = new THREE.TorusGeometry(0.15, 0.03, 16, 100, Math.PI)
    const mouthMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFF0000,
      roughness: 0.3,
      metalness: 0.1
    })
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
    mouth.position.set(0, 1, 0.35)
    mouth.rotation.x = Math.PI / 2
    mouth.name = 'mouth'
    avatarGroup.add(mouth)

    // Add eyebrows for more expression
    const eyebrowGeometry = new THREE.BoxGeometry(0.15, 0.02, 0.02)
    const eyebrowMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
    
    const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial)
    leftEyebrow.position.set(-0.15, 1.35, 0.35)
    leftEyebrow.name = 'leftEyebrow'
    
    const rightEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial)
    rightEyebrow.position.set(0.15, 1.35, 0.35)
    rightEyebrow.name = 'rightEyebrow'
    
    avatarGroup.add(leftEyebrow, rightEyebrow)

    avatarGroup.position.y = 0.75
    scene.add(avatarGroup)
    setAvatar(avatarGroup)

    // Adjust camera to focus on the avatar
    camera.position.set(0, 2, 5)
    controls.target.set(0, 1, 0)

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
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
    if (avatar) {
      const mouth = avatar.children.find(child => child.name === 'mouth') as THREE.Mesh
      const leftEyebrow = avatar.children.find(child => child.name === 'leftEyebrow') as THREE.Mesh
      const rightEyebrow = avatar.children.find(child => child.name === 'rightEyebrow') as THREE.Mesh

      if (mouth && leftEyebrow && rightEyebrow) {
        switch (newEmotion) {
          case 'happy':
            mouth.rotation.z = 0
            mouth.position.y = 0.95
            leftEyebrow.rotation.z = 0.2
            rightEyebrow.rotation.z = -0.2
            break
          case 'sad':
            mouth.rotation.z = Math.PI
            mouth.position.y = 1.05
            leftEyebrow.rotation.z = -0.2
            rightEyebrow.rotation.z = 0.2
            break
          default:
            mouth.rotation.z = 0
            mouth.position.y = 1
            leftEyebrow.rotation.z = 0
            rightEyebrow.rotation.z = 0
        }
      }
    }
  }

  const handleScoreChange = (newScore: number) => {
    setScore(newScore)
    if (newScore > 7) {
      handleEmotionChange('happy')
    } else if (newScore < 4) {
      handleEmotionChange('sad')
    } else {
      handleEmotionChange('neutral')
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <div ref={mountRef} className="w-full h-[400px] md:h-[600px]" />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <TextToSpeech />
          <AvatarCustomizer avatar={avatar} />
          <QuizComponent onScoreChange={handleScoreChange} />
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-2">Current Score: {score}</h2>
              <p>Emotion: {emotion}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

