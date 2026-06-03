'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle Geometry
    const particlesCount = 150;
    const positions = new Float32Array(particlesCount * 3);
    const speeds = new Float32Array(particlesCount);
    const sizes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Spread particles in a 3D box
      positions[i] = (Math.random() - 0.5) * 60; // X
      positions[i + 1] = (Math.random() - 0.5) * 60; // Y
      positions[i + 2] = (Math.random() - 0.5) * 50; // Z

      speeds[i / 3] = 0.02 + Math.random() * 0.03;
      sizes[i / 3] = 0.1 + Math.random() * 0.3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom Canvas Texture for perfectly round, soft particles
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(229, 9, 20, 1)');
        gradient.addColorStop(0.3, 'rgba(229, 9, 20, 0.8)');
        gradient.addColorStop(1, 'rgba(229, 9, 20, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.8,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6
    });

    // Points Mesh
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - width / 2) / 100;
      mouseY = (event.clientY - height / 2) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse follow parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particleSystem.rotation.y = targetX * 0.15;
      particleSystem.rotation.x = -targetY * 0.15;

      // Particle upward drift
      const positionsArr = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount * 3; i += 3) {
        positionsArr[i + 1] += speeds[i / 3]; // drift up in Y
        
        // Wrap around when particle goes off screen
        if (positionsArr[i + 1] > 30) {
          positionsArr[i + 1] = -30;
          positionsArr[i] = (Math.random() - 0.5) * 60;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      style={{ background: 'radial-gradient(circle at center, #100505 0%, #000000 100%)' }}
    />
  );
}
