import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[300px] md:h-[500px] ">
      <div className="absolute inset-0">
        <Image
          src="/images/abouts/banner-1.png"
          alt="Modern building with blue sky"
          fill
          priority
          className="object-cover aspect-video"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#fafcff]/20 to-[#ebf2ff]/80"></div>
      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center">
        <div className="ml-auto mr-10 md:mr-20 flex flex-col items-start">
          <h1 className="text-3xl md:text-6xl font-bold text-charcoal mb-6">关于我们</h1>
          <p className="text-2xl md:text-5xl text-dark-blue-grey">
            科技赋能育人·护成长·筑未来
          </p>
        </div>
      </div>
    </section>
  );
}
