import Image from "next/image";

export default function ServiceTriangle() {
  return (
    <section className="sm:py-20 py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-bold text-charcoal text-2xl md:text-[56px] tracking-[0] leading-normal mb-4">
          一站式服务全方位解决学校、家长、学生痛点
        </h2>

        <div className="relative mt-16 flex justify-center">
          <div className="relative w-full">
            <Image
              src="/images/products/service.svg"
              alt="Service Triangle Diagram"
              className="w-full h-auto"
              width={1920}
              height={1080}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
