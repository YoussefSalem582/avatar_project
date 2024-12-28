'use client'

import React from 'react'
import * as THREE from 'three'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AvatarCustomizerProps {
  avatar: THREE.Group | null
}

export function AvatarCustomizer({ avatar }: AvatarCustomizerProps) {
  const handleColorChange = (part: string, color: string) => {
    if (avatar) {
      const meshToChange = avatar.children.find(child => child.name === part) as THREE.Mesh
      if (meshToChange && meshToChange.material instanceof THREE.MeshStandardMaterial) {
        meshToChange.material.color.setHex(parseInt(color.replace('#', ''), 16))
        meshToChange.material.needsUpdate = true
      }
    }
  }

  const handleRotationChange = (rotation: number) => {
    if (avatar) {
      avatar.rotation.y = rotation * Math.PI * 2
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Avatar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="bodyColor">Body Color:</Label>
            <input
              id="bodyColor"
              type="color"
              onChange={(e) => handleColorChange('body', e.target.value)}
              className="w-full h-10 cursor-pointer"
              aria-label="Change body color"
            />
          </div>
          <div>
            <Label htmlFor="headColor">Head Color:</Label>
            <input
              id="headColor"
              type="color"
              onChange={(e) => handleColorChange('head', e.target.value)}
              className="w-full h-10 cursor-pointer"
              aria-label="Change head color"
            />
          </div>
          <div>
            <Label htmlFor="rotation">Rotation:</Label>
            <Slider
              id="rotation"
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => handleRotationChange(value[0])}
              aria-label="Rotate avatar"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

