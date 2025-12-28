import { useState } from "react";
import { Package, Truck, CheckCircle, Search } from "lucide-react";

const orderSteps = [
  { id: 1, title: "Order Placed", icon: Package },
  { id: 2, title: "Shipped", icon: Truck },
  { id: 3, title: "Out for Delivery", icon: Truck },
  { id: 4, title: "Delivered", icon: CheckCircle },
];

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const handleTrack = () => {
    if (!orderId.trim()) return;

    // Demo logic (replace with API later)
    const randomStep = Math.floor(Math.random() * 4);
    setCurrentStep(randomStep);
  };

  return (
    <div className="container py-20 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Track Your Order
      </h1>

      {/* Search Box */}
      <div className="flex gap-3 mb-12">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleTrack}
          className="px-6 py-3 bg-primary text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition"
        >
          <Search size={18} />
          Track
        </button>
      </div>

      {/* Order Status */}
      {currentStep !== null && (
        <div className="bg-background border border-border rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-8 text-center">
            Order Status
          </h2>

          <div className="flex justify-between items-center">
            {orderSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStep;

              return (
                <div
                  key={step.id}
                  className="flex-1 flex flex-col items-center text-center relative"
                >
                  {/* Line */}
                  {index !== 0 && (
                    <div
                      className={`absolute left-0 top-6 w-full h-[2px] -z-10 ${
                        isActive ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  <p
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
