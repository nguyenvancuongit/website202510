"use client";

import React from "react";
import Image from "next/image";

import { PRODUCT_SECTION_IMAGE_POSITIONS } from "@/config/constants";
import { ProductSection } from "@/hooks/api/use-products";
import { Media } from "@/types";

interface ProductPreviewProps {
  data: {
    name: string;
    description?: string;
    category_id: number;
    sections: ProductSection[];
  };
  bannerMedia?: Media | null;
  categories: any[];
}

export function ProductPreview({ data, bannerMedia }: ProductPreviewProps) {
  // Render section image with controlled size
  const renderSectionImage = (section: ProductSection) => {
    const sectionImage = section.section_image;

    if (sectionImage) {
      return (
        <div className="section-image">
          <Image
            src={sectionImage.path}
            alt={section.title}
            className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm mx-auto"
            width={384}
            height={192}
          />
        </div>
      );
    }
  };

  // Render sub-items with controlled sizes
  const renderSubItems = (subItems: any[], isVertical = false) => {
    if (!subItems || subItems.length === 0) {
      return null;
    }

    const containerClass = isVertical
      ? "flex flex-col space-y-3"
      : "grid grid-cols-1 md:grid-cols-3 gap-4";

    return (
      <div className={containerClass}>
        {subItems.map((subItem, subIndex) => (
          <div key={subItem.id || subIndex} className="rounded-lg p-4">
            {subItem.image_media ? (
              <Image
                src={subItem.image_media.path}
                alt={subItem.title}
                className="w-full h-24 object-cover rounded mb-3"
                width={384}
                height={192}
              />
            ) : (
              <div className="w-full h-24 bg-gray-200 rounded mb-3 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg
                    className="w-6 h-6 mx-auto mb-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs">无图片</span>
                </div>
              </div>
            )}
            <h4 className="font-medium mb-2 text-gray-900 text-sm">
              {subItem.title}
            </h4>
            <div
              className="text-xs text-gray-600 prose prose-sm line-clamp-2 break-words"
              dangerouslySetInnerHTML={{ __html: subItem.description }}
            />
          </div>
        ))}
      </div>
    );
  };

  // Render sub-items for left/right layout with circular images
  // const renderSubItemsHorizontal = (subItems: any[]) => {
  //   if (!subItems || subItems.length === 0) {
  //     return null;
  //   }

  //   return (
  //     <div className="space-y-4">
  //       {subItems.map((subItem, subIndex) => (
  //         <div key={subItem.id || subIndex} className="flex items-start gap-4">
  //           {subItem.image_media ? (
  //             <Image
  //               src={subItem.image_media.path}
  //               alt={subItem.title}
  //               className="w-16 h-16 object-cover rounded-full flex-shrink-0"
  //               width={384}
  //               height={192}
  //             />
  //           ) : (
  //             <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
  //               <svg
  //                 className="w-8 h-8 text-gray-400"
  //                 fill="currentColor"
  //                 viewBox="0 0 20 20"
  //               >
  //                 <path
  //                   fillRule="evenodd"
  //                   d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
  //                   clipRule="evenodd"
  //                 />
  //               </svg>
  //             </div>
  //           )}
  //           <div className="flex-1">
  //             <h4 className="font-medium mb-2 text-gray-900 text-sm">
  //               {subItem.title}
  //             </h4>
  //             <div
  //               className="text-xs text-gray-600 prose prose-sm line-clamp-2 break-words whitespace-pre-wrap"
  //               dangerouslySetInnerHTML={{ __html: subItem.description }}
  //             />
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  // Render each section based on image position
  const renderSection = (section: ProductSection, index: number) => {
    const position =
      PRODUCT_SECTION_IMAGE_POSITIONS.TOP;
    const hasSubItems =
      section.section_sub_items && section.section_sub_items.length > 0;

    return (
      <div key={section.id || index} className="rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-8 text-gray-900 text-center">
          {section.title}
        </h2>

        {position === PRODUCT_SECTION_IMAGE_POSITIONS.TOP && (
          <div className="space-y-4 overflow-hidden">
            {renderSectionImage(section)}
            {section.description && (
              <div
                className="prose max-w-none text-gray-700 text-sm text-center leading-relaxed break-words line-clamp-2"
                dangerouslySetInnerHTML={{ __html: section.description }}
              />
            )}
            {hasSubItems && (
              <div className="mt-6">
                {renderSubItems(section.section_sub_items, false)}
              </div>
            )}
          </div>
        )}

        {/* {position === PRODUCT_SECTION_IMAGE_POSITIONS.BOTTOM && (
          <div className="space-y-4 overflow-hidden">
            {section.description && (
              <div
                className="prose max-w-none text-gray-700 text-sm text-center leading-relaxed break-words line-clamp-2"
                dangerouslySetInnerHTML={{ __html: section.description }}
              />
            )}
            {hasSubItems && (
              <div className="mb-6">
                {renderSubItems(section.section_sub_items, false)}
              </div>
            )}
            {renderSectionImage(section)}
          </div>
        )} */}

        {/* {position === PRODUCT_SECTION_IMAGE_POSITIONS.LEFT && (
          <div className="space-y-4 overflow-hidden">
            {hasSubItems && section.description && (
              <div
                className="prose max-w-none text-gray-700 text-sm text-center leading-relaxed break-words line-clamp-2"
                dangerouslySetInnerHTML={{ __html: section.description }}
              />
            )}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                <div className="h-64 flex items-center justify-center">
                  {renderSectionImage(section)}
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="h-64 flex items-center">
                  <div className="w-full">
                    {!hasSubItems && section.description && (
                      <div
                        className="prose max-w-none text-gray-700 text-sm leading-relaxed break-words line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: section.description,
                        }}
                      />
                    )}
                    {hasSubItems &&
                      renderSubItemsHorizontal(section.section_sub_items)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* {position === PRODUCT_SECTION_IMAGE_POSITIONS.RIGHT && (
          <div className="space-y-4 overflow-hidden">
            {hasSubItems && section.description && (
              <div
                className="prose max-w-none text-gray-700 text-sm text-center leading-relaxed break-words line-clamp-2"
                dangerouslySetInnerHTML={{ __html: section.description }}
              />
            )}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                <div className="h-64 flex items-center">
                  <div className="w-full">
                    {!hasSubItems && section.description && (
                      <div
                        className="prose max-w-none text-gray-700 text-sm leading-relaxed break-words line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: section.description,
                        }}
                      />
                    )}
                    {hasSubItems &&
                      renderSubItemsHorizontal(section.section_sub_items)}
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="h-64 flex items-center justify-center">
                  {renderSectionImage(section)}
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen">
      {/* Banner Section */}
      <div className="relative mb-8">
        {bannerMedia ? (
          <div className="relative">
            <Image
              src={bannerMedia.path}
              alt={data.name}
              className="w-full h-80 object-cover"
              width={384}
              height={192}
            />
            {/* Product Name positioned at top-left */}
            <div className="absolute top-8 left-8">
              <h1 className="text-2xl font-bold text-white">
                {data.name || "产品预览"}
              </h1>
            </div>
            {/* Button positioned at center-left */}
            <div className="absolute inset-y-0 left-8 flex items-center">
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2">
                合作线索表单按钮
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-80 flex items-start justify-start p-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-4">
                {data.name || "产品预览"}
              </h1>
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2">
                合作线索表单按钮
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-8 bg-white">
        {data.sections && data.sections.length > 0 ? (
          <div className="space-y-8">
            {data.sections.map((section, index) =>
              renderSection(section, index)
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 rounded-lg shadow-sm">
            <p className="text-lg">暂无章节内容</p>
            <p className="text-sm mt-2">请添加章节内容来完善产品信息</p>
          </div>
        )}
      </div>
    </div>
  );
}
