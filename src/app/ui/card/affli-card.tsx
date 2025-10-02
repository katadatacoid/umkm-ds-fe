import React from 'react';

// Define the types for the props
export interface Feature {
  featureText: string;  // Text for the feature
  widgetIcon: string;  // SVG for the feature
}

interface AffiliateCardProps {
  title: string;
  plan: string;
  features: Feature[];  // Array of features with text and SVG widget
  buttonText: string; // Dynamic button text
  onButtonClick: () => void; // Callback for the button
}

const AffiliateCard: React.FC<AffiliateCardProps> = ({
  title,
  plan,
  features,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div
      className="bg-green-100 py-12 px-6 rounded-2xl flex justify-center items-start"
      style={{
        backgroundImage: 'url("images/bg-stars.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-center w-full max-w-xs flex flex-col justify-between h-full">
        <h2 className="text-2xl font-semibold mb-6 text-green-c text-center">{title}</h2>
        <div className="bg-white text-gray-700 p-6 rounded-2xl shadow-lg w-full flex flex-col justify-between h-full">
          <div className="mb-4">
            <h2 className="text-2xl font-medium text-left">{plan}</h2>
            <ul className="mt-4 text-sm space-y-2 text-left pl-5">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2"> 
                  <IconWithMask maskImage={feature.widgetIcon} />
                </span> {/* Dynamic SVG widget for each feature */}
                  {feature.featureText}
                </li>
              ))}
            </ul>
          </div>
          <button
            className="mt-6 w-full py-4 px-8 bg-green-c text-sm text-white font-semibold rounded-full self-end"
            onClick={onButtonClick} // Handle button click
          >
            {buttonText} {/* Dynamic button text */}
          </button>
        </div>
      </div>
    </div>
  );
};


export function IconWithMask({ maskImage }: { maskImage: string }) {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-[#31b380] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[18px_18px] ml-0 mt-0 size-[18px]" style={{ maskImage: `url('${maskImage}')` }} />
    </div>
  );
}

export default AffiliateCard;
