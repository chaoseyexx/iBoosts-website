"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars, Grid, Float } from "@react-three/drei";
import * as THREE from "three";

// Animated Grid Floor
function CyberGrid() {
    return (
        <group position={[0, -2, 0]} rotation={[0, 0, 0]}>
            <Grid
                renderOrder={-1}
                position={[0, 0, 0]}
                infiniteGrid
                cellSize={1}
                cellThickness={0.6}
                sectionSize={3.3}
                sectionThickness={1.5}
                sectionColor="#f5a623" // Gold section lines
                cellColor="#2d333b"    // Dark subtle cells
                fadeDistance={30}
                fadeStrength={1}
            />
        </group>
    );
}

// Floating geometric accents
function FloatingGeometry() {
    return (
        <group>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                {/* Gold Icosahedron */}
                <mesh position={[4, 1, -5]}>
                    <icosahedronGeometry args={[0.8, 0]} />
                    <meshStandardMaterial
                        color="#f5a623"
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            </Float>
            <Float speed={3} rotationIntensity={1} floatIntensity={0.5}>
                {/* Blue Octahedron */}
                <mesh position={[-5, -1, -8]}>
                    <octahedronGeometry args={[1.2, 0]} />
                    <meshStandardMaterial
                        color="#5c9eff"
                        wireframe
                        transparent
                        opacity={0.2}
                    />
                </mesh>
            </Float>
        </group>
    );
}

// Main 3D Scene - Cyber Gaming & Premium
export function HeroScene() {
    return (
        <div className="absolute inset-0 w-full h-full bg-[#0a0e13]">
            <Canvas
                camera={{ position: [0, 1, 6], fov: 60 }}
                gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, 1.5]} // Reduced from [1, 2] for better performance
            >
                {/* Dark Atmosphere */}
                <color attach="background" args={['#0a0e13']} />
                <fog attach="fog" args={['#0a0e13', 5, 25]} />

                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#f5a623" />
                <pointLight position={[-10, 5, -10]} intensity={0.8} color="#5c9eff" />
                <spotLight
                    position={[0, 10, 0]}
                    intensity={0.5}
                    penumbra={1}
                    color="#ffffff"
                />

                {/* Cyber Floor - REMOVED */}
                {/* <CyberGrid /> */}

                {/* Background Stars - Deep & Moving */}
                <Stars
                    radius={50}
                    depth={50}
                    count={2000} // Reduced from 5000
                    factor={4}
                    saturation={0}
                    fade
                    speed={0.5}
                />

                {/* Floating Particles - Magic Dust */}
                <Sparkles
                    count={80} // Reduced from 150
                    scale={[20, 10, 10]}
                    size={3}
                    speed={0.3}
                    opacity={0.4}
                    color="#f5a623"
                />

                {/* 3D Geometry Accents - REMOVED */}
                {/* <FloatingGeometry /> */}
            </Canvas>
        </div>
    );
}
