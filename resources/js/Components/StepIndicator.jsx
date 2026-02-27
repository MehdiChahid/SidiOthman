export default function StepIndicator({ currentStep, totalSteps, steps }) {
    return (
        <div className="w-full py-6 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Progress bar */}
                <div className="relative mb-8">
                    <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full -translate-y-1/2"></div>
                    <div 
                        className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full -translate-y-1/2 transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    ></div>
                    
                    {/* Step circles */}
                    <div className="relative flex justify-between">
                        {steps.map((step, index) => {
                            const stepNumber = index + 1;
                            const isCompleted = stepNumber < currentStep;
                            const isCurrent = stepNumber === currentStep;
                            
                            return (
                                <div key={stepNumber} className="flex flex-col items-center">
                                    <div 
                                        className={`
                                            w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold
                                            transition-all duration-300 transform
                                            ${isCompleted 
                                                ? 'bg-gradient-to-br from-green-400 to-green-600 text-white scale-100 shadow-lg' 
                                                : isCurrent
                                                ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white scale-110 shadow-2xl ring-4 ring-blue-300'
                                                : 'bg-gray-300 text-gray-600 scale-100'
                                            }
                                        `}
                                    >
                                        {isCompleted ? (
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                    <div className="mt-3 text-center">
                                        <p className={`text-sm font-semibold ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                                            {step.title}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Current step title */}
                <div className="text-center mt-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {steps[currentStep - 1].description}
                    </h2>
                </div>
            </div>
        </div>
    );
}

