import React from 'react';

// Define the types for the props
interface PricingCardProps {
  id?: string;
  title: string;
  plan: string;
  price: string;
  description: string;
  features: string[];
  textButton?: string;
  selected?: boolean;
  onTapButton?: (id?: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ id, title, plan, price, description, features, textButton, onTapButton, selected = false }) => {
  return (
    <div
      className="bg-green-100 py-8 px-4 sm:py-12 sm:px-6 rounded-2xl flex justify-center items-start" // Adjusted padding for mobile
      style={{ backgroundImage: 'url("images/bg-stars.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="text-center w-full max-w-xs flex flex-col justify-between h-full">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-c">{title}</h2> 
        <div className="bg-white text-gray-700 p-4 sm:p-6 rounded-2xl shadow-lg w-full flex flex-col justify-between h-full">
          <div className="mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-2xl font-medium text-left">{plan}</h2>
            <p className="text-lg sm:text-xl font-bold text-gray-800 text-left">{price}</p>
            <p className="text-xs sm:text-sm mt-2 text-left">{description}</p>
            
            <ul className="mt-3 sm:mt-4 text-xs sm:text-sm space-y-2 text-left pl-5">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="block w-4 h-4 mr-2"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 17 17"
                  >
                    <g id="Group">
                      <path
                        d="M2.3957 5.96141C2.28623 5.46831 2.30304 4.95554 2.44457 4.47067C2.5861 3.98579 2.84776 3.54449 3.2053 3.1877C3.56284 2.83091 4.00468 2.57017 4.48986 2.42966C4.97503 2.28914 5.48783 2.27341 5.9807 2.38391C6.25198 1.95964 6.6257 1.61048 7.06741 1.36863C7.50913 1.12677 8.00461 1 8.5082 1C9.01179 1 9.50728 1.12677 9.94899 1.36863C10.3907 1.61048 10.7644 1.95964 11.0357 2.38391C11.5293 2.27293 12.043 2.28859 12.5289 2.42945C13.0149 2.5703 13.4573 2.83177 13.8151 3.18953C14.1728 3.54729 14.4343 3.98972 14.5752 4.47566C14.716 4.96161 14.7317 5.47529 14.6207 5.96891C15.045 6.24019 15.3941 6.61391 15.636 7.05562C15.8778 7.49733 16.0046 7.99282 16.0046 8.49641C16.0046 9 15.8778 9.49549 15.636 9.9372C15.3941 10.3789 15.045 10.7526 14.6207 11.0239C14.7312 11.5168 14.7155 12.0296 14.575 12.5148C14.4344 12.9999 14.1737 13.4418 13.8169 13.7993C13.4601 14.1569 13.0188 14.4185 12.5339 14.56C12.0491 14.7016 11.5363 14.7184 11.0432 14.6089C10.7723 15.0348 10.3983 15.3855 9.9558 15.6284C9.51333 15.8713 9.01672 15.9987 8.51195 15.9987C8.00718 15.9987 7.51057 15.8713 7.06811 15.6284C6.62564 15.3855 6.25163 15.0348 5.9807 14.6089C5.48783 14.7194 4.97503 14.7037 4.48986 14.5632C4.00468 14.4227 3.56284 14.1619 3.2053 13.8051C2.84776 13.4483 2.5861 13.007 2.44457 12.5222C2.30304 12.0373 2.28623 11.5245 2.3957 11.0314C1.96817 10.7608 1.61601 10.3865 1.37199 9.94332C1.12796 9.5001 1 9.00237 1 8.49641C1 7.99046 1.12796 7.49272 1.37199 7.0495C1.61601 6.60628 1.96817 6.23198 2.3957 5.96141Z"
                        id="Vector"
                        stroke="var(--stroke-0, #575966)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></path>
                      <path
                        d="M6.2582 8.49641L7.7582 9.99641L10.7582 6.99641"
                        id="Vector_2"
                        stroke="var(--stroke-0, #575966)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></path>
                    </g>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => {
              if (onTapButton) {
                onTapButton(id);  // Ensure onTapButton is called only if it is defined
              }
            }}
            className={`mt-6 w-full py-4 px-8 sm:py-4 sm:px-6 ${selected ? 'bg-blue-c' : 'bg-green-c'} text-sm sm:text-base text-white rounded-full font-semibold self-end`}
          >
            {textButton || 'Coba Sekarang'}
          </button> {/* Align button to bottom */}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
