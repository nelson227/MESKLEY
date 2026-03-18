"use client";

import { Check } from "lucide-react";

interface FormStepperProps {
  steps: string[];
  currentStep: number;
}

export default function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <div className="flex items-center overflow-x-auto pb-2">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center flex-shrink-0">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                i < currentStep
                  ? "bg-gold border-gold text-black"
                  : i === currentStep
                  ? "border-gold text-gold bg-white"
                  : "border-gray-light text-gray bg-white"
              }`}
            >
              {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
            </div>
            <span className={`text-[11px] mt-1 whitespace-nowrap ${i <= currentStep ? "text-gold font-medium" : "text-gray"}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-12 mx-1 ${i < currentStep ? "bg-gold" : "bg-gray-light"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
