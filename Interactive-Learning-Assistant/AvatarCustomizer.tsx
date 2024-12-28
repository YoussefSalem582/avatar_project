import React from 'react'
import * as THREE from 'three'

interface AvatarCustomizerProps {
  avatar: THREE.Object3D | null
}

export function AvatarCustomizer({ avatar }: AvatarCustomizerProps) {
  const handleColorChange = (color: string) => {
    if (avatar) {
      avatar.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.setHex(parseInt(color.replace('#', ''), 16))
          child.material.needsUpdate = true
        }
      })
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Customize Avatar</h2>
      <div>
        <label className="block mb-1">Color:</label>
        <input
          type="color"
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-full h-10 cursor-pointer"
          aria-label="Change avatar color"
          id="avatar-color"
        />
      </div>
      {/* Add more customization options here */}
    </div>
  )
}

