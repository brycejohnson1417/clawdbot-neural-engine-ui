import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { BotStatus } from '../types';
import { NeuralCore } from './NeuralCore';

interface SceneProps {
  status: BotStatus;
}

// Camera rig creates a smooth sway tracking the mouse
const CameraRig = () => {
    const { camera, pointer } = useThree();
    const vec = new THREE.Vector3();
  
    useFrame(() => {
      camera.position.lerp(vec.set(pointer.x * 2, pointer.y * 2, 12), 0.02);
      camera.lookAt(0, 0, 0);
    });
    
    return null;
};

export const Scene: React.FC<SceneProps> = ({ status }) => {
  // Map status to bloom intensity
  const bloomIntensity = status === BotStatus.WORKING ? 2.5 : status === BotStatus.ERROR ? 3.0 : status === BotStatus.DISCONNECTED ? 0.2 : 1.5;

  return (
    <div className="w-full h-full relative bg-gray-950">
        <Canvas shadows>
            <color attach="background" args={['#030508']} />
            <fog attach="fog" args={['#030508', 10, 30]} />
            
            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
            
            <Suspense fallback={null}>
                <Environment preset="night" />
                
                {/* Main Lighting */}
                <ambientLight intensity={status === BotStatus.DISCONNECTED ? 0.1 : 0.8} color="#ffffff" />
                <directionalLight position={[5, 10, 5]} intensity={1.5} color="#4488ff" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#ff00a2" />

                <NeuralCore status={status} />
                
                {status !== BotStatus.DISCONNECTED && (
                    <Stars radius={50} depth={20} count={2000} factor={4} saturation={0} fade speed={status === BotStatus.WORKING ? 2 : 0.5} />
                )}

                <CameraRig />

                <EffectComposer disableNormalPass>
                    <Bloom 
                        luminanceThreshold={0.2} 
                        luminanceSmoothing={0.9} 
                        intensity={bloomIntensity} 
                        mipmapBlur 
                    />
                    <ChromaticAberration 
                         /* @ts-ignore offset format depends on vers */
                        offset={[0.002, 0.002]} 
                        blendFunction={BlendFunction.NORMAL} 
                        radialModulation={false}
                        modulationOffset={0}
                    />
                    <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Suspense>
        </Canvas>
    </div>
  );
};
