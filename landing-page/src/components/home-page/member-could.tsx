"use client";

import React, { useEffect, useRef, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import MemberCard from "./member-card";

interface Icon {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  id: number;
}

export interface Member {
  id: number;
  name: string;
  bio: string;
  image?: string;
  role?: string;
}

interface MemberCloudProps {
  images?: string[];
  members?: Member[];
  size?: number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function MemberCloud({ images, members, size = 600 }: MemberCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);
  const [rotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // When true, automatic rotation should pause (mouse is over the globe)
  const [isHovering, setIsHovering] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [targetRotation, setTargetRotation] = useState<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    distance: number;
    startTime: number;
    duration: number;
  } | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const rotationRef = useRef(rotation);
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);

  // Create image canvases once when images change or members change
  useEffect(() => {
    const numberOfItems = images?.length || members?.length || 0;
    if (numberOfItems === 0) {
      return;
    }

    imagesLoadedRef.current = new Array(numberOfItems).fill(false);

    const newIconCanvases = Array.from({ length: numberOfItems }).map(
      (_, index: number) => {
        const offscreen = document.createElement("canvas");
        // Use higher resolution for better quality
        offscreen.width = 120;
        offscreen.height = 120;
        const offCtx = offscreen.getContext("2d");

        if (offCtx) {
          // Enable high-quality image rendering
          offCtx.imageSmoothingEnabled = true;
          offCtx.imageSmoothingQuality = "high";

          const imageUrl = images?.[index];
          const member = members?.[index];

          if (imageUrl) {
            // Handle image URLs directly
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.src = imageUrl;
            img.onload = () => {
              offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

              // Create circular clipping path with higher resolution
              offCtx.beginPath();
              offCtx.arc(60, 60, 60, 0, Math.PI * 2);
              offCtx.closePath();
              offCtx.clip();

              // Draw the image at higher resolution
              offCtx.drawImage(img, 0, 0, 120, 120);

              imagesLoadedRef.current[index] = true;
            };
            img.onerror = () => {
              // If image fails to load, create fallback avatar
              createFallbackAvatar(offCtx, member);
              imagesLoadedRef.current[index] = true;
            };
          } else {
            // Create fallback avatar for members without images
            createFallbackAvatar(offCtx, member);
            imagesLoadedRef.current[index] = true;
          }

          // Helper function to create fallback avatar
          function createFallbackAvatar(
            ctx: CanvasRenderingContext2D,
            memberData?: { name: string }
          ) {
            ctx.clearRect(0, 0, offscreen.width, offscreen.height);

            // Create circular background
            ctx.beginPath();
            ctx.arc(60, 60, 60, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            // Add subtle border
            ctx.strokeStyle = "#e5e7eb";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Add member initials if name is available
            if (memberData?.name) {
              const initials = memberData.name
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("");

              ctx.fillStyle = "#6b7280";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
              ctx.fillText(initials, 60, 60);
            }
          }
        }
        return offscreen;
      }
    );

    iconCanvasesRef.current = newIconCanvases;
  }, [images, members]); // Generate initial icon positions on a sphere
  useEffect(() => {
    const items = images || members || [];
    const newIcons: Icon[] = [];
    const numIcons = items.length || 20;

    // Fibonacci sphere parameters
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;

      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;

      newIcons.push({
        x: x * 300,
        y: y * 300,
        z: z * 300,
        scale: 1,
        opacity: 1,
        id: i,
      });
    }
    setIconPositions(newIcons);
  }, [images, members]);

  // Helper function to detect member under mouse
  const detectMemberUnderMouse = (
    clientX: number,
    clientY: number
  ): Member | null => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) {
      return null;
    }

    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    for (const icon of iconPositions) {
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      const rotatedX = icon.x * cosY - icon.z * sinY;
      const rotatedZ = icon.x * sinY + icon.z * cosY;
      const rotatedY = icon.y * cosX + rotatedZ * sinX;

      const screenX = canvasRef.current!.width / 2 + rotatedX;
      const screenY = canvasRef.current!.height / 2 + rotatedY;

      const scale = (rotatedZ + 600) / 900;

      // Check if mouse is over the avatar (circular area)
      const avatarRadius = 35 * scale;
      const dx = x - screenX;
      const dy = y - screenY;

      const isOverAvatar = dx * dx + dy * dy < avatarRadius * avatarRadius;

      // Check if mouse is over the name text (rectangular area)
      let isOverName = false;
      if (members && members[icon.id]) {
        const fontSize = Math.max(12, 16 * scale);
        const nameY = screenY + 42 * scale; // Name is at y-position 42 relative to center
        const nameWidth = members[icon.id].name.length * fontSize * 0.6; // Approximate text width
        const nameHeight = fontSize;

        // Define rectangular hit area for the name
        const nameLeft = screenX - nameWidth / 2;
        const nameRight = screenX + nameWidth / 2;
        const nameTop = nameY;
        const nameBottom = nameY + nameHeight;

        isOverName =
          x >= nameLeft && x <= nameRight && y >= nameTop && y <= nameBottom;
      }

      if ((isOverAvatar || isOverName) && members && members[icon.id]) {
        return members[icon.id];
      }
    }
    return null;
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Only trigger click if user didn't drag
    if (!isDragging) {
      const memberUnderMouse = detectMemberUnderMouse(e.clientX, e.clientY);
      if (memberUnderMouse) {
        setSelectedMember(memberUnderMouse);
        setShowPopup(true);
      } else {
        setSelectedMember(null);
        setShowPopup(false);
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && canvasRef.current) {
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      setMousePos({ x, y });
    }

    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.002,
        y: rotationRef.current.y - deltaX * 0.002,
      };

      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
    // Mouseover detection disabled - only click will trigger popup
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Animation and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Enable high-quality rendering for the main canvas
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const dx = mousePos.x - centerX;
      const dy = mousePos.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.003 + (distance / maxDistance) * 0.01;

      if (targetRotation) {
        const elapsed = performance.now() - targetRotation.startTime;
        const progress = Math.min(1, elapsed / targetRotation.duration);
        const easedProgress = easeOutCubic(progress);

        rotationRef.current = {
          x:
            targetRotation.startX +
            (targetRotation.x - targetRotation.startX) * easedProgress,
          y:
            targetRotation.startY +
            (targetRotation.y - targetRotation.startY) * easedProgress,
        };

        if (progress >= 1) {
          setTargetRotation(null);
        }
      } else if (!isDragging && !isHovering) {
        rotationRef.current = {
          x: rotationRef.current.x + (dy / canvas.height) * speed,
          y: rotationRef.current.y + (dx / canvas.width) * speed,
        };
      }

      //
      iconPositions.forEach((icon, index) => {
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);

        const rotatedX = icon.x * cosY - icon.z * sinY;
        const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX + rotatedZ * sinX;

        const scale = (rotatedZ + 600) / 900;
        const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 450) / 600));

        ctx.save();
        ctx.translate(
          canvas.width / 2 + rotatedX,
          canvas.height / 2 + rotatedY
        );
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;

        const hasImages = images && images.length > 0;
        const hasMembers = members && members.length > 0;

        if (hasImages || hasMembers) {
          // Only try to render if we have data
          if (
            iconCanvasesRef.current[index] &&
            imagesLoadedRef.current[index]
          ) {
            // Draw the high-resolution image/avatar with better quality
            ctx.drawImage(iconCanvasesRef.current[index], -30, -30, 60, 60);

            // Draw border around the image/avatar
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.60)";
            ctx.lineWidth = 5.2;
            ctx.stroke();
          }
        } else {
          // Show numbered circles if no images are provided
          ctx.beginPath();
          ctx.arc(0, 0, 30, 0, Math.PI * 2);
          ctx.fillStyle = "#4444ff";
          ctx.fill();

          // Draw border around the numbered circle
          ctx.strokeStyle = "rgba(255, 255, 255, 0.60)";
          ctx.lineWidth = 5.2;
          ctx.stroke();

          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "20px Arial";
          ctx.fillText(`${icon.id + 1}`, 0, 0);
        }

        // Draw member name under the item if members data is available
        if (members && members[icon.id]) {
          // Set high-quality text rendering
          ctx.textAlign = "center";
          ctx.textBaseline = "top";

          // Calculate responsive font size with better minimum
          const fontSize = Math.max(12, 16 * scale);
          ctx.font = `${fontSize}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;

          // Add dark text stroke for better readability against light backgrounds
          ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
          ctx.lineWidth = Math.max(2, 3 * scale);
          ctx.strokeText(members[icon.id].name, 0, 42); // Increased spacing from 35 to 42

          // White text fill
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fillText(members[icon.id].name, 0, 42);
        }
        ctx.restore();
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [images, iconPositions, isDragging, isHovering, mousePos, targetRotation, members]);

  return (
    <div className="relative w-full max-w-4xl mx-auto" style={{}}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="rounded-full w-full h-auto max-w-full"
        style={{
          imageRendering: "auto",
          aspectRatio: "1 / 1",
        }}
        aria-label="Interactive 3D Icon Cloud"
        role="img"
      />
      <div
        className="pointer-events-none absolute top-1/6 left-1/7  w-3/4 h-3/4 rounded-full"
        style={{
          background: "rgba(31, 81, 246, 0.1)",
          filter: "blur(40px)",
        }}
      />

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent
          className="max-w-md p-0 w-fit border-none h-fit bg-transparent focus-visible:outline-none"
          closeButtonClassName="text-white z-100"
        >
          {selectedMember && <MemberCard member={selectedMember} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
