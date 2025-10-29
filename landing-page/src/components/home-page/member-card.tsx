import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

import { Member } from "./member-could";

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <Card
      className="relative w-96 h-fit border-0 overflow-hidden shadow-2xl transform transition-all duration-300 bg-transparent"
      style={{
        background: "linear-gradient(180deg, #0381FF 0%, #67B3FF 100%)",
      }}
    >
      <CardContent className="relative z-10 p-8 h-full flex flex-col">
        <div className="flex justify-start mb-6">
          <div className="w-32 h-40 rounded-lg overflow-hidden shadow-lg bg-white">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                width={128}
                height={160}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-gray-400 text-4xl font-bold">
                  {member.name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 text-white">
          <h3 className="text-2xl font-bold mb-4 text-white">
            {member.name}
          </h3>

          <div className="space-y-2 text-white/95">
            {member.bio.split("\n").map((line, index) => (
              <p key={index} className="text-sm leading-relaxed">
                {line.trim()}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
