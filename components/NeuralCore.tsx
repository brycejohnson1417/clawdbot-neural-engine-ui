import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { BotStatus } from '../types';

export const NeuralCore = ({ status }: { status: BotStatus }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);

  // Status mapping
  const config = useMemo(() => {
    switch(status) {
      case BotStatus.IDLE:
        return { color: '#00ccff', emissiveIntensity: 1.0, distort: 0.3, speed: 1.5, ringSpeed: 0.4, scale: 1 };
      case BotStatus.WORKING:
        return { color: '#ffaa00', emissiveIntensity: 1.5, distort: 0.6, speed: 5, ringSpeed: 2.0, scale: 1.25 };
      case BotStatus.ERROR:
        return { color: '#ff0033', emissiveIntensity: 2.0, distort: 1.0, speed: 10, ringSpeed: 4.0, scale: 0.9 };
      case BotStatus.DISCONNECTED:
        return { color: '#445566', emissiveIntensity: 0.1, distort: 0.05, speed: 0.2, ringSpeed: 0.05, scale: 0.8 };
      default:
        return { color: '#00ccff', emissiveIntensity: 1.0, distort: 0.3, speed: 1.5, ringSpeed: 0.4, scale: 1 };
    }
  }, [status]);

  const targetColor = useMemo(() => new THREE.Color(config.color), [config.color]);

  useFrame((state, delta) => {
    if (coreRef.current) {
        // smooth scale transition
        coreRef.current.scale.lerp(new THREE.Vector3(config.scale, config.scale, config.scale), delta * 3);
    }
    
    if (materialRef.current) {
        materialRef.current.color.lerp(targetColor, delta * 3);
        materialRef.current.emissive.lerp(targetColor, delta * 3);
        materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, config.distort, delta * 2);
        materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, config.speed, delta * 2);
        materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, config.emissiveIntensity, delta * 2);
    }

    // Rotate rings
    if (ring1Ref.current) {
        ring1Ref.current.rotation.x += delta * config.ringSpeed;
        ring1Ref.current.rotation.y += delta * config.ringSpeed * 0.8;
    }
    if (ring2Ref.current) {
        ring2Ref.current.rotation.y += delta * config.ringSpeed * 1.2;
        ring2Ref.current.rotation.z += delta * config.ringSpeed * 0.9;
    }
    if (ring3Ref.current) {
        ring3Ref.current.rotation.x -= delta * config.ringSpeed * 1.5;
        ring3Ref.current.rotation.y -= delta * config.ringSpeed * 0.5;
    }

    // Glitch effect on error
    if (status === BotStatus.ERROR && groupRef.current) {
        groupRef.current.position.x = (Math.random() - 0.5) * 0.1;
        groupRef.current.position.y = (Math.random() - 0.5) * 0.1;
    } else if (groupRef.current) {
        groupRef.current.position.lerp(new THREE.Vector3(0,0,0), delta * 5);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={config.speed * 0.5} rotationIntensity={0.5} floatIntensity={1}>
        {/* The Distorted Core */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.5, 64]} />
          <MeshDistortMaterial
            ref={materialRef}
            color={config.color}
            emissive={config.color}
            emissiveIntensity={config.emissiveIntensity}
            distort={config.distort}
            speed={config.speed}
            roughness={0.1}
            metalness={0.9}
            wireframe={status === BotStatus.DISCONNECTED}
          />
        </mesh>

        {/* Data Rings */}
        <mesh ref={ring1Ref} scale={2.5}>
          <torusGeometry args={[1, 0.015, 16, 100]} />
          <meshBasicMaterial color={config.color} transparent opacity={0.4} wireframe />
        </mesh>

        <mesh ref={ring2Ref} scale={3.2}>
          <torusGeometry args={[1, 0.008, 16, 100]} />
          <meshBasicMaterial color={config.color} transparent opacity={0.2} />
        </mesh>
        
        <mesh ref={ring3Ref} scale={4.0}>
          <torusGeometry args={[1, 0.03, 4, 100]} />
          <meshBasicMaterial color={config.color} transparent opacity={0.15} wireframe />
        </mesh>

        {/* Intricate Outer Shells */}
        <mesh scale={2.2}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color={config.color} transparent opacity={0.1} wireframe />
        </mesh>
        <mesh scale={3.5} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <octahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={config.color} transparent opacity={0.05} wireframe />
        </mesh>

        {/* Inner glow points */}
        <Sparkles 
            count={status === BotStatus.DISCONNECTED ? 20 : 200} 
            scale={6} 
            size={3} 
            speed={config.speed * 0.5} 
            opacity={0.6} 
            color={config.color} 
        />
        <Sparkles 
            count={status === BotStatus.WORKING ? 100 : 0} 
            scale={8} 
            size={1.5} 
            speed={config.speed} 
            opacity={0.4} 
            color={config.color} 
        />
      </Float>
    </group>
  );
};
