import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState, memo } from "react";
import { SketchPicker } from "react-color";

// Reusable Color Picker
function ColorPicker({ label, color, onChange }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h4>{label}</h4>
      <SketchPicker color={color} onChange={onChange} />
    </div>
  );
}

// Reusable Size Slider
function SizeSlider({ label, value, min, max, step, onChange }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h4>{label}</h4>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

// Avatar Component
const Avatar = memo(({ config }) => {
  const { headColor, bodyColor, armColor, legColor, headSize, bodySize, armSize, legSize } = config;

  return (
    <>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[headSize, 32, 32]} />
        <meshStandardMaterial color={headColor} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={bodySize} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[-0.9, 0.5, 0]}>
        <boxGeometry args={armSize} />
        <meshStandardMaterial color={armColor} />
      </mesh>
      <mesh position={[0.9, 0.5, 0]}>
        <boxGeometry args={armSize} />
        <meshStandardMaterial color={armColor} />
      </mesh>
      <mesh position={[-0.4, -1, 0]}>
        <boxGeometry args={legSize} />
        <meshStandardMaterial color={legColor} />
      </mesh>
      <mesh position={[0.4, -1, 0]}>
        <boxGeometry args={legSize} />
        <meshStandardMaterial color={legColor} />
      </mesh>
    </>
  );
});

// Main App
function App() {
  const defaultConfig = {
    headColor: "#ffcc99",
    bodyColor: "#8ecae6",
    armColor: "#219ebc",
    legColor: "#023047",
    headSize: 0.5,
    bodySize: [1, 1.5, 0.5],
    armSize: [0.3, 1, 0.3],
    legSize: [0.4, 1, 0.4],
  };

  const [config, setConfig] = useState(defaultConfig);

  const updateColor = (part, color) => {
    setConfig((prev) => ({ ...prev, [part]: color.hex }));
  };

  const updateSize = (part, index, size) => {
    setConfig((prev) => {
      const newSize = Array.isArray(prev[part]) ? [...prev[part]] : prev[part];
      if (Array.isArray(newSize)) newSize[index] = size;
      return { ...prev, [part]: newSize };
    });
  };

  const resetConfig = () => setConfig(defaultConfig);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "300px", padding: "10px", background: "#f4f4f4", borderRight: "1px solid #ddd", overflowY: "auto" }}>
        <h3>Customize Avatar</h3>
        <ColorPicker label="Head Color" color={config.headColor} onChange={(color) => updateColor("headColor", color)} />
        <ColorPicker label="Body Color" color={config.bodyColor} onChange={(color) => updateColor("bodyColor", color)} />
        <ColorPicker label="Arm Color" color={config.armColor} onChange={(color) => updateColor("armColor", color)} />
        <ColorPicker label="Leg Color" color={config.legColor} onChange={(color) => updateColor("legColor", color)} />

        <SizeSlider
          label="Head Size"
          value={config.headSize}
          min="0.3"
          max="1.5"
          step="0.1"
          onChange={(e) => updateSize("headSize", 0, parseFloat(e.target.value))}
        />
        <SizeSlider
          label="Body Width"
          value={config.bodySize[0]}
          min="0.5"
          max="2"
          step="0.1"
          onChange={(e) => updateSize("bodySize", 0, parseFloat(e.target.value))}
        />
        <SizeSlider
          label="Arm Length"
          value={config.armSize[1]}
          min="0.5"
          max="2"
          step="0.1"
          onChange={(e) => updateSize("armSize", 1, parseFloat(e.target.value))}
        />
        <SizeSlider
          label="Leg Length"
          value={config.legSize[1]}
          min="0.5"
          max="2"
          step="0.1"
          onChange={(e) => updateSize("legSize", 1, parseFloat(e.target.value))}
        />
        <button onClick={resetConfig} style={{ marginTop: "20px", padding: "10px", width: "100%" }}>
          Reset to Default
        </button>
      </div>
      <Canvas camera={{ position: [5, 5, 5] }}>
        <color attach="background" args={["#333333"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Avatar config={config} />
      </Canvas>
    </div>
  );
}

export default App;
